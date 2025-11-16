// src/pages/RestaurantePedidosPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

// --- INTERFACES ---

export interface ItemPedido {
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  observacao?: string;
}

export interface Pedido {
  id: number;
  clienteNome: string;
  dataPedido: string;
  status: string;
  total: number;
  entregadorNome?: string;
  itens: ItemPedido[];
  enderecoEntrega: string;
}

interface Entregador {
  id: number;
  email: string;
  nome: string;
  role: string;
}

const statusOptions = [
  "PENDENTE", "CONFIRMADO", "PREPARANDO", 
  "SAIU_PARA_ENTREGA", "ENTREGUE", "CANCELADO"
];

// === O Componente ===
export const RestaurantePedidosPage: React.FC = () => {
  const { user, token, logout } = useAuth();
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntregadores, setSelectedEntregadores] = useState<{[key: number]: string}>({});

  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  const restauranteId = user?.restauranteId;

  // --- BUSCAR PEDIDOS ---
  const fetchPedidos = useCallback(async () => {
    if (!token || !restauranteId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pedidos/restaurante/${restauranteId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Falha ao buscar pedidos.");
      
      const data = await response.json();
      const lista = Array.isArray(data) ? data : (data.data || []);
      setPedidos(lista); 
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar pedidos.");
    } finally {
      setLoading(false);
    }
  }, [token, restauranteId]);

  // --- BUSCAR ENTREGADORES ---
  const fetchEntregadores = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`/api/usuarios/entregadores`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEntregadores(data.data || data);
      }
    } catch (err) {
      console.error("Erro ao buscar entregadores:", err);
    }
  }, [token]);

  useEffect(() => {
    if(restauranteId) {
      fetchPedidos();
      fetchEntregadores();
    }
  }, [fetchPedidos, fetchEntregadores, restauranteId]);

  // --- AÇÕES ---

  const handleMudarStatus = async (pedidoId: number, novoStatus: string) => { 
    setError(null);
    const requestBody: { status: string; entregadorId?: number } = { status: novoStatus };

    if (novoStatus === 'SAIU_PARA_ENTREGA') {
      const entregadorId = selectedEntregadores[pedidoId];
      if (!entregadorId) {
        alert("Selecione um entregador antes de mudar para 'Saiu para Entrega'.");
        return; 
      }
      requestBody.entregadorId = Number(entregadorId);
    }

    try {
      const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error("Erro ao atualizar status.");
      fetchPedidos(); 
    } catch (err) {
      // --- CORREÇÃO 1: Usando o 'err' para o linter não reclamar ---
      console.error("Erro na mudança de status:", err);
      alert("Erro ao mudar status");
    }
  };

  const handleEntregadorSelect = (pedidoId: number, entregadorId: string) => {
    setSelectedEntregadores(prev => ({ ...prev, [pedidoId]: entregadorId }));
  };

  // --- LÓGICA DO MODAL ---
  const abrirModal = (pedido: Pedido) => {
    setPedidoSelecionado(pedido);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setPedidoSelecionado(null);
  };

  // --- ESTILOS (CSS-in-JS) ---
  const styles: { [key: string]: React.CSSProperties } = {
    page: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    th: { borderBottom: '2px solid #ddd', padding: '12px', textAlign: 'left', background: '#f8f9fa', fontWeight: 'bold' },
    td: { borderBottom: '1px solid #ddd', padding: '12px', verticalAlign: 'middle' },
    btnDetalhes: { background: '#3498db', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
    select: { padding: '6px', borderRadius: '4px', border: '1px solid #ccc' },
    
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modalContent: {
      background: 'white', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '500px',
      maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
    },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
    btnClose: { background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', fontWeight: 'bold' },
    itemRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #eee' },
    totalRow: { display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '10px', borderTop: '2px solid #eee', fontWeight: 'bold', fontSize: '1.1rem' }
  };

  const formatMoney = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  if (loading && pedidos.length === 0) return <div style={styles.page}>Carregando...</div>;

  return (
    <div style={styles.page}>
      {/* CABEÇALHO */}
      <div style={styles.header}>
        <h1 style={{margin: 0, color: '#2c3e50'}}>Painel do Restaurante</h1>
        <div>
          <button onClick={fetchPedidos} style={{marginRight: '10px', padding: '8px'}}>Atualizar</button>
          <button onClick={logout} style={{background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer'}}>Sair</button>
        </div>
      </div>
      
      {error && <div style={{color: 'red', marginBottom: '15px'}}>{error}</div>}
      
      {/* TABELA */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Cliente</th>
            <th style={styles.th}>Hora</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Ações</th>
            <th style={styles.th}>Mudar Status</th>
            <th style={styles.th}>Entregador</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id} style={{background: 'white'}}>
              <td style={styles.td}>#{pedido.id}</td>
              <td style={styles.td}>{pedido.clienteNome}</td>
              <td style={styles.td}>{new Date(pedido.dataPedido).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</td>
              
              {/* --- CORREÇÃO 2: Mesclando os estilos --- */}
              <td style={{ ...styles.td, fontWeight: 'bold', color: '#27ae60' }}>
                {formatMoney(pedido.total)}
              </td>
              
              <td style={styles.td}>
                <span style={{padding: '4px 8px', borderRadius: '12px', background: '#eee', fontSize: '0.85rem'}}>
                    {pedido.status}
                </span>
              </td>

              <td style={styles.td}>
                <button style={styles.btnDetalhes} onClick={() => abrirModal(pedido)}>
                  Ver Itens
                </button>
              </td>
              
              <td style={styles.td}>
                <select 
                  style={styles.select}
                  value={pedido.status}
                  onChange={(e) => handleMudarStatus(pedido.id, e.target.value)}
                  disabled={pedido.status === 'ENTREGUE' || pedido.status === 'CANCELADO'}
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              
              <td style={styles.td}>
                <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                    <span style={{fontSize: '0.8rem', color: '#666'}}>{pedido.entregadorNome || "Não atribuído"}</span>
                    <select 
                    style={styles.select}
                    value={selectedEntregadores[pedido.id] || ""}
                    onChange={(e) => handleEntregadorSelect(pedido.id, e.target.value)}
                    disabled={['SAIU_PARA_ENTREGA', 'ENTREGUE', 'CANCELADO'].includes(pedido.status)}
                    >
                    <option value="">Atribuir...</option>
                    {entregadores.map(e => <option key={e.id} value={e.id}>{e.nome || e.email}</option>)}
                    </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- MODAL --- */}
      {modalAberto && pedidoSelecionado && (
        <div style={styles.modalOverlay} onClick={(e) => { if(e.target === e.currentTarget) fecharModal() }}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={{margin: 0}}>Pedido #{pedidoSelecionado.id}</h2>
              <button onClick={fecharModal} style={styles.btnClose}>&times;</button>
            </div>

            <div style={{marginBottom: '15px', fontSize: '0.95rem', color: '#555'}}>
                <p style={{margin: '5px 0'}}><strong>Cliente:</strong> {pedidoSelecionado.clienteNome}</p>
                <p style={{margin: '5px 0'}}><strong>Entrega em:</strong> {pedidoSelecionado.enderecoEntrega}</p>
            </div>

            <hr style={{border: '0', borderTop: '1px solid #eee', margin: '15px 0'}} />

            <h3 style={{fontSize: '1.1rem', marginBottom: '10px'}}>Itens:</h3>
            <div>
                {pedidoSelecionado.itens && pedidoSelecionado.itens.map((item, idx) => (
                    <div key={idx} style={styles.itemRow}>
                        <div style={{flex: 1}}>
                            <span style={{fontWeight: 'bold', marginRight: '8px'}}>{item.quantidade}x</span>
                            <span>{item.nomeProduto}</span>
                            {item.observacao && (
                                <div style={{fontSize: '0.85rem', color: '#888', marginLeft: '25px', marginTop: '2px'}}>
                                    Obs: {item.observacao}
                                </div>
                            )}
                        </div>
                        <div style={{fontWeight: 'bold', color: '#555'}}>
                            {formatMoney(item.subtotal)}
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.totalRow}>
                <span>Total Geral:</span>
                <span style={{color: '#27ae60', fontSize: '1.3rem'}}>
                    {formatMoney(pedidoSelecionado.total)}
                </span>
            </div>

            <div style={{marginTop: '20px', textAlign: 'right'}}>
                <button onClick={fecharModal} style={{padding: '10px 20px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};