import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PedidoEntregador {
  id: number;
  clienteNome: string;
  enderecoEntrega: string;
  valorTotal: number;
  status: string;
}

export const EntregadorPainelPage: React.FC = () => {
  const { token, user, logout } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoEntregador[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Usamos useCallback para "memorizar" a função e ela não mudar a cada render
  const fetchMeusPedidos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Este endpoint será criado no Java a seguir
      const response = await fetch('/api/pedidos/entregador/pendentes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const json = await response.json();
        // Garante que pegamos a lista, seja direta ou dentro de .data
        const lista = Array.isArray(json) ? json : (json.data || []);
        setPedidos(lista);
      }
    } catch (error) {
      console.error("Erro ao buscar entregas", error);
    } finally {
      setLoading(false);
    }
  }, [token]); // Dependência do useCallback: só recria se o token mudar

  // 2. Agora podemos colocar a função aqui sem o ESLint reclamar
  useEffect(() => {
    fetchMeusPedidos();
  }, [fetchMeusPedidos]);

  // Função para marcar como ENTREGUE
  const confirmarEntrega = async (pedidoId: number) => {
    if (!window.confirm("Confirmar entrega?")) return;

    try {
      const response = await fetch(`/api/pedidos/${pedidoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'ENTREGUE' })
      });

      if (response.ok) {
        alert("Entrega confirmada!");
        fetchMeusPedidos(); 
      } else {
        alert("Erro ao confirmar.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Olá, {user?.nome} (Entregador)</h1>
        <button onClick={logout} style={{ padding: '8px 16px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </header>

      <h2>Entregas Pendentes</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : pedidos.length === 0 ? (
        <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center' }}>
          <p>Nenhuma entrega pendente.</p>
          <button onClick={fetchMeusPedidos} style={{ marginTop: '10px', cursor: 'pointer', padding: '5px 10px' }}>Atualizar</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {pedidos.map(pedido => (
            <div key={pedido.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong>Pedido #{pedido.id}</strong>
                <span style={{ color: '#e67e22', fontWeight: 'bold' }}>{pedido.status}</span>
              </div>
              <p><strong>Cliente:</strong> {pedido.clienteNome}</p>
              <p>📍 <strong>Endereço:</strong> {pedido.enderecoEntrega}</p>
              
              <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button 
                  onClick={() => confirmarEntrega(pedido.id)}
                  style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};