import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage'; // Importe a sua página Home real


export const RoleRoute = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ⚠️ CRÍTICO: Checa a Role APÓS o carregamento do estado (isLoading === false)
    if (!isLoading && user) {
      if (user.role === 'ENTREGADOR') {
        // Redirecionamento forçado para a área correta, 
        // substituindo a Home Page no histórico.
        navigate('/entregador/painel', { replace: true }); 
      } else if (user.role === 'RESTAURANTE') {
        // Redireciona o restaurante
        navigate('/restaurante/pedidos', { replace: true }); 
      }
      // Se for CLIENTE, ele continua na Home Page (próximo passo da função)
    }
  }, [isLoading, user, navigate]); 
  
  // 1. Enquanto o estado de autenticação carrega (após o F5/Voltar)
  if (isLoading) {
    return <div>Carregando sessão e verificando perfil...</div>;
  }
  
  // 2. Se a verificação terminou e o usuário não foi redirecionado
  // (ou seja, é um CLIENTE ou está deslogado), renderiza a Home Page.
  return <HomePage />;
};