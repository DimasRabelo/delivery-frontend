import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { usePedidoCount } from '../context/PedidoCountContext'; 

export const Header = () => {
  const { isAuthenticated, logout, user, openLoginModal } = useAuth();
  const { pedidosCount } = usePedidoCount(); 
  const { totalItens, valorTotal } = useCart();

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      background: '#fff',
      borderBottom: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div>
        <Link to="/" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Delivery API
        </Link>
      </div>
      
      <nav style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>

        {isAuthenticated ? (
          <>
            {/* --- MENU DE USUÁRIO LOGADO --- */}
            <Link to="/meus-pedidos" style={{ 
              textDecoration: 'none', 
              color: '#007bff', 
              fontWeight: '500',
              display: 'flex', 
              alignItems: 'center',
              position: 'relative' 
            }}>
              Meus Pedidos 
              {pedidosCount > 0 && (
                <span style={{
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  marginLeft: '5px',
                  minWidth: '18px',
                  textAlign: 'center'
                }}>
                  {pedidosCount}
                </span>
              )}
            </Link>

            <Link to="/carrinho" style={{ textDecoration: 'none', color: '#007bff', fontWeight: '500' }}>
              Carrinho ({totalItens}) - R$ {valorTotal.toFixed(2)}
            </Link>

            <span style={{ fontSize: '0.9em', color: '#555' }}>Olá, {user?.nome}</span>
            
            <Link to="/meu-perfil" style={{ textDecoration: 'none', color: '#007bff' }}>
              Perfil
            </Link>
            
            <Link to="/meus-enderecos" style={{ textDecoration: 'none', color: '#007bff' }}>
              Endereços
            </Link>
            
            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: 'inherit', fontWeight: 'bold' }}>
              Sair
            </button>
          </>
        ) : (
          <>
            {/* --- MENU DE VISITANTE (NÃO LOGADO) --- */}
            
            {/* 1. LINK PARA O LOGIN DO RESTAURANTE (NOVIDADE) */}
            <Link 
              to="/admin/login" 
              style={{ 
                textDecoration: 'none', 
                color: '#555', 
                fontSize: '0.9rem',
                border: '1px solid #ccc',
                padding: '6px 12px',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
            >
              Sou Restaurante
            </Link>

            {/* 2. BOTÃO DE LOGIN DO CLIENTE */}
            <button 
              onClick={openLoginModal} 
              style={{ 
                background: '#007bff', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: '4px'
              }}
            >
              Entrar / Cadastrar
            </button>
          </>
        )}
      </nav>
    </header>
  );
};