import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// (Interface para o DTO que o backend envia - PedidoResponseDTO)
interface PedidoResponse {
  id: number;
  dataPedido: string;
  status: string; 
  restauranteNome: string;
  total: number;
  enderecoEntrega: string;
}

// (Interface para a 'Página' do Spring Boot - seu PagedResponseWrapper)
interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // O número da página atual (base 0)
  last: boolean;
  first: boolean;
}

// Componente da Página
export const MeusPedidosPage = () => {
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const { token } = useAuth();
  
  const [paginaAtual, setPaginaAtual] = useState(0); 
  const [totalPaginas, setTotalPaginas] = useState(0);

  // Efeito para buscar os pedidos
  useEffect(() => {
    if (!token) return;

    const fetchMeusPedidos = async () => {
      try {
        setLoading(true);
        setErro(null);

        const url = `/api/pedidos/meus?page=${paginaAtual}&size=10&sort=dataPedido,desc`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const erroData = await response.json();
          // (Comentário '@ts-expect-error' removido)
          throw new Error(erroData.message || 'Falha ao buscar pedidos.');
        }

        const data: SpringPage<PedidoResponse> = await response.json();
        
        setPedidos(data.content); 
        setTotalPaginas(data.totalPages); 

      } catch (err) {
        if (err instanceof Error) setErro(err.message);
        else setErro('Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchMeusPedidos();
  }, [token, paginaAtual]); 

  // Funções para mudar de página
  const irParaPaginaAnterior = () => {
    setPaginaAtual(p => Math.max(p - 1, 0)); 
  };

  const irParaProximaPagina = () => {
    setPaginaAtual(p => Math.min(p + 1, totalPaginas - 1)); 
  };


  // Renderização
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      
      {/* Link de "Voltar" que adicionamos */}
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontSize: '0.9em' }}>
        &larr; Voltar para o Início
      </Link>

      <h2 style={{ marginTop: '15px' }}>Meus Pedidos</h2>

      {loading && <p>Carregando...</p>}
      {erro && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{erro}</p>}

      {!loading && !erro && (
        <>
          {pedidos.length === 0 && paginaAtual === 0 ? (
            <p>Você ainda não fez nenhum pedido. <Link to="/">Peça agora!</Link></p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {pedidos.map(pedido => (
                <div key={pedido.id} style={styles.pedidoCard}>
                  <div style={styles.cardHeader}>
                    <strong>{pedido.restauranteNome}</strong>
                    <span style={styles.statusPill}>{pedido.status}</span>
                  </div>
                  <div style={styles.cardBody}>
                    <span>Pedido #{pedido.id}</span>
                    <span>{new Date(pedido.dataPedido).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                    <span>Total: R$ {pedido.total.toFixed(2)}</span>
                  </div>
                  <div style={styles.cardFooter}>
                    <Link to={`/pedidos/${pedido.id}`}>Ver Detalhes</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botões de Paginação */}
          {totalPaginas > 1 && (
            <div style={styles.paginationControls}>
              <button onClick={irParaPaginaAnterior} disabled={paginaAtual === 0}>
                &larr; Anterior
              </button>
              <span>
                Página {paginaAtual + 1} de {totalPaginas}
              </span>
              {/* ========================================================== */}
              {/* --- CORREÇÃO DO 'onClick' DO BOTÃO 'Próxima' --- */}
              {/* ========================================================== */}
              <button onClick={irParaProximaPagina} disabled={paginaAtual >= totalPaginas - 1}>
                Próxima &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Estilos
const styles = {
  pedidoCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  } as React.CSSProperties,
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '1.2em',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  } as React.CSSProperties,
  cardBody: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95em',
    color: '#333',
    padding: '5px 0',
  } as React.CSSProperties,
  cardFooter: {
    marginTop: '15px',
    textAlign: 'right',
  } as React.CSSProperties,
  statusPill: {
    backgroundColor: '#eee',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.9em',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  paginationControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '25px',
  } as React.CSSProperties,
};