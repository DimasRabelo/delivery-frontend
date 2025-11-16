import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth'; 

// === CORREÇÃO AQUI: Importe do novo arquivo de Contexto ===
import { usePedidoCount } from '../context/PedidoCountContext'; 

import { useEffect, useState } from 'react';

// === DEFINIÇÕES DE TIPO (sem mudanças) ===
interface Endereco { id: number; rua: string; numero: string; bairro: string; cidade: string; estado: string; apelido: string; }
interface ApiErrorResponse { message: string; error?: string; status?: number; }
function isErrorResponse(data: unknown): data is ApiErrorResponse { return (typeof data === 'object' && data !== null && 'message' in data); }
function isEnderecoArray(data: unknown): data is Endereco[] { return (Array.isArray(data) && (data.length === 0 || (typeof data[0] === 'object' && data[0] !== null && 'apelido' in data[0]))); }
interface PedidoSuccessResponse { success: boolean; data: { id: number; }; }
function isPedidoSuccess(data: unknown): data is PedidoSuccessResponse { if (typeof data !== 'object' || data === null) { return false; } if (!('success' in data) || (data as { success: boolean }).success !== true) { return false; } if (!('data' in data)) { return false; } const dataField = (data as { data: unknown }).data; if (typeof dataField !== 'object' || dataField === null) { return false; } if (!('id' in dataField)) { return false; } return true; }

// === COMPONENTE ===
export const CartPage = () => {
  const { itens, totalItens, valorTotal, clearCart } = useCart();
  
  const { token, isAuthenticated, openLoginModal } = useAuth(); 
  
  // Agora o hook vai funcionar corretamente
  const { refreshPedidosCount } = usePedidoCount(); 
  
  const navigate = useNavigate();

  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [selectedEnderecoId, setSelectedEnderecoId] = useState<string>(''); 
  const [metodoPagamento, setMetodoPagamento] = useState<string>('PIX');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // === FETCH ENDEREÇOS (sem mudanças) ===
  useEffect(() => {
    const fetchEnderecos = async () => {
      if (!token) { setLoading(false); return; }
      try {
        setLoading(true); 
        setErro(null);
        const response = await fetch('/api/enderecos/meus', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data: unknown = await response.json(); 
        if (!response.ok) {
          if (isErrorResponse(data)) throw new Error(data.message);
          throw new Error('Falha ao buscar endereços');
        }
        let enderecosData: unknown = data;
        if (typeof data === 'object' && data !== null && 'content' in data) {
          enderecosData = (data as { content: unknown }).content;
        }
        if (isEnderecoArray(enderecosData)) {
          setEnderecos(enderecosData);
          setSelectedEnderecoId(enderecosData.length > 0 ? String(enderecosData[0].id) : '');
        } else {
           throw new Error('Formato de dados de endereço inesperado');
        }
      } catch (err) {
        if (err instanceof Error) setErro(err.message);
        else setErro('Ocorreu um erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchEnderecos();
    } else {
      setLoading(false);
      setEnderecos([]);
      setSelectedEnderecoId('');
    }
  }, [token, isAuthenticated]);

  // === FINALIZAR PEDIDO ===
  const handleFazerPedido = async () => {
    setErro(null);

    // O "MURO DO MODAL"
    if (!isAuthenticated) {
      openLoginModal();
      return; 
    }

    // --- SE PASSOU, O USUÁRIO ESTÁ LOGADO ---
    if (loading || itens.length === 0 || !token || !selectedEnderecoId || !metodoPagamento) {
      alert("Por favor, selecione um endereço de entrega e um método de pagamento.");
      return;
    }

    const pedidoDTO = {
      restauranteId: itens[0].restauranteId,
      enderecoEntregaId: Number(selectedEnderecoId),
      metodoPagamento,
      observacoes: "Pedido feito via App React",
      itens: itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        opcionaisIds: item.opcionaisIds
      }))
    };

    console.log("📦 PedidoDTO enviado:", JSON.stringify(pedidoDTO, null, 2));

    try {
      setLoading(true);
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoDTO)
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        if (isErrorResponse(data)) throw new Error(data.message);
        throw new Error('Falha ao criar o pedido');
      }
      if (isPedidoSuccess(data)) {
        alert(`Pedido criado com sucesso! (ID: ${data.data.id})`);
        clearCart();
        
        // Atualiza o contador no Header instantaneamente
        await refreshPedidosCount();
        
        navigate("/");
      } else {
        throw new Error('Resposta de sucesso inesperada do servidor.');
      }
    } catch (err) {
      if (err instanceof Error) setErro(err.message);
      else setErro('Ocorreu um erro desconhecido ao finalizar o pedido');
    } finally {
      setLoading(false);
    }
  };

  const restauranteId = itens.length > 0 ? itens[0].restauranteId : null;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <Link to={restauranteId ? `/restaurante/${restauranteId}` : "/"}>
        &larr; Continuar comprando
      </Link>

      <h2 style={{ marginTop: '20px' }}>Meu Carrinho</h2>

      {loading && <p>Carregando...</p>}
      {erro && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}>{erro}</p>}

      {itens.length === 0 && !loading ? (
        <p>Seu carrinho está vazio. <Link to="/">Comece a comprar!</Link></p>
      ) : (
        <div>
          {itens.map((item) => (
            <div key={item.cartItemId} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              <strong>{item.quantidade}x {item.produtoNome}</strong>
              <span style={{ float: 'right' }}>
                R$ {(item.precoUnitario * item.quantidade).toFixed(2)}
              </span>
              <div style={{ fontSize: '0.9em', color: '#555', paddingLeft: '10px' }}>
                (Preço Unit.: R$ {item.precoUnitario.toFixed(2)})
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px', fontSize: '1.2em', fontWeight: 'bold', textAlign: 'right' }}>
            <p>Total de Itens: {totalItens}</p>
            <p>Valor Total: R$ {valorTotal.toFixed(2)}</p>
          </div>

          <hr style={{ margin: '20px 0' }} />

          <h3>Finalizar Pedido</h3>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="endereco" style={{ display: 'block', marginBottom: '5px' }}>
              Endereço de Entrega:
            </label>
           <select 
              id="endereco" 
              value={selectedEnderecoId} 
              onChange={(e) => setSelectedEnderecoId(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              disabled={loading || !isAuthenticated}
            >
              <option value="">{isAuthenticated ? "Selecione um endereço" : "Faça login para ver"}</option>
              {enderecos.map((end) => (
                <option key={end.id} value={String(end.id)}> 
                  {end.apelido} ({end.rua}, {end.numero})
                </option>
              ))}
            </select>
            {isAuthenticated && enderecos.length === 0 && !loading && (
              <p>Você não tem endereços cadastrados. <Link to="/meus-enderecos">Cadastrar agora</Link></p>
            )}
            {!isAuthenticated && !loading && (
               <p style={{fontSize: '0.9em', color: '#555'}}>Faça login para selecionar seus endereços.</p>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="pagamento" style={{ display: 'block', marginBottom: '5px' }}>
              Método de Pagamento:
            </label>
            <select
              id="pagamento"
              value={metodoPagamento}
              onChange={(e) => setMetodoPagamento(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
              disabled={loading}
            >
              <option value="PIX">PIX</option>
              <option value="CARTAO_CREDITO">Cartão de Crédito</option>
              <option value="CARTAO_DEBITO">Cartão de Débito</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>

          <button
            onClick={handleFazerPedido}
            disabled={loading || itens.length === 0 || (isAuthenticated && !selectedEnderecoId)}
            style={{
              padding: '15px 30px',
              background: 'green',
              color: 'white',
              border: 'none',
              fontSize: '1.2em',
              cursor: 'pointer',
              marginTop: '20px',
              width: '100%'
            }}
          >
            {loading ? 'Enviando...' : (isAuthenticated ? 'Fazer Pedido' : 'Fazer Login para Continuar')}
          </button>
        </div>
      )}
    </div>
  );
};