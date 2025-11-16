import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// --- INTERFACES ---

interface ItemPedido {
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  observacao?: string;
}

interface PedidoDetalhe {
  id: number;
  dataPedido: string;
  status: string;
  restauranteNome: string;
  total: number;
  subtotal: number;
  taxaEntrega: number;
  enderecoEntrega: string;
  clienteNome: string;
  itens: ItemPedido[];
}

// CORREÇÃO: Agora vamos usar esta interface no fetch
interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
}

export const PedidoDetailPage = () => {
  const { id: pedidoId } = useParams<{ id: string }>(); 
  const [pedido, setPedido] = useState<PedidoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { token } = useAuth() as { token?: string | null };

  // Helper para formatar dinheiro
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  useEffect(() => {
    if (!token || !pedidoId) return;

    const fetchPedidoDetalhe = async () => {
      try {
        setLoading(true);
        setErro(null);

        const url = `/api/pedidos/${pedidoId}`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // --- CORREÇÃO AQUI: Usamos o 'as ApiResponse<...>' ---
        // Isso consome a interface e remove o erro do Linter
        const jsonData = await response.json() as ApiResponse<PedidoDetalhe>;

        if (!response.ok) {
          throw new Error(jsonData.message || 'Falha ao buscar pedido.');
        }
        
        // Verifica se o dado está dentro de 'data' ou na raiz (flexibilidade)
        const dadosPedido = jsonData.data || jsonData;
        
        // TypeScript pode reclamar se jsonData não for exatamente PedidoDetalhe quando não tem 'data',
        // mas na prática isso resolve o fluxo.
        setPedido(dadosPedido as unknown as PedidoDetalhe);

      } catch (err) {
        if (err instanceof Error) setErro(err.message);
        else setErro('Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetalhe();
  }, [token, pedidoId]);

  // --- RENDERIZAÇÃO ---

  if (loading) return <div style={{ padding: '20px' }}>Carregando detalhes...</div>;
  if (erro) return <div style={{ padding: '20px', color: 'red' }}>Erro: {erro}</div>;
  if (!pedido) return <div style={{ padding: '20px' }}>Pedido não encontrado.</div>;

  return (
    <div style={styles.container}>
      <Link to="/meus-pedidos" style={styles.linkVoltar}>&larr; Voltar para Meus Pedidos</Link>
      
      <div style={styles.header}>
        <h2 style={{margin: 0}}>Pedido #{pedido.id}</h2>
        <span style={styles.statusPill}>{pedido.status}</span>
      </div>

      {/* CARD 1: Informações Gerais */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Informações</h3>
        <p><strong>Restaurante:</strong> {pedido.restauranteNome}</p>
        <p><strong>Cliente:</strong> {pedido.clienteNome}</p>
        <p><strong>Data:</strong> {new Date(pedido.dataPedido).toLocaleString('pt-BR')}</p>
        <p><strong>Endereço:</strong> {pedido.enderecoEntrega}</p>
      </div>

      {/* CARD 2: Itens */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Itens do Pedido</h3>
        
        {pedido.itens && pedido.itens.length > 0 ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {pedido.itens.map((item, index) => (
              <div key={index} style={styles.itemRow}>
                <div style={{flex: 1}}>
                  <span style={{fontWeight: 'bold'}}>{item.quantidade}x </span>
                  <span>{item.nomeProduto}</span>
                  {item.observacao && (
                    <div style={styles.obs}>Obs: {item.observacao}</div>
                  )}
                </div>
                <div style={{fontWeight: 'bold', marginLeft: '15px'}}>
                   {formatMoney(item.subtotal)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Nenhum item encontrado.</p>
        )}
      </div>

      {/* CARD 3: Financeiro */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Resumo Financeiro</h3>
        
        <div style={styles.totalRow}>
          <span>Subtotal Itens:</span>
          <span>{formatMoney(pedido.subtotal)}</span>
        </div>
        
        <div style={styles.totalRow}>
          <span>Taxa de Entrega:</span>
          <span>{formatMoney(pedido.taxaEntrega)}</span>
        </div>
        
        <div style={styles.totalFinal}>
          <span>Total Pago:</span>
          <span style={{color: '#27ae60'}}>{formatMoney(pedido.total)}</span>
        </div>
      </div>
    </div>
  );
};

// --- Estilos CSS-in-JS ---
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' },
  linkVoltar: { display: 'inline-block', marginBottom: '15px', textDecoration: 'none', color: '#3498db', fontWeight: 'bold' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid #eee', marginBottom: '20px' },
  statusPill: { backgroundColor: '#eee', padding: '6px 12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '0.9rem' },
  card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '20px' },
  cardTitle: { marginTop: 0, borderBottom: '1px solid #f0f0f0', paddingBottom: '10px', marginBottom: '15px', color: '#333' },
  itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px dashed #eee' },
  obs: { fontSize: '0.85em', color: '#777', marginTop: '4px', fontStyle: 'italic' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1rem', padding: '6px 0', color: '#555' },
  totalFinal: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '2px solid #eee', fontWeight: 'bold', fontSize: '1.4rem' },
};