import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// O segredo é este "export" antes do "const"
export const EntregadorRoute = () => {
  // 🔑 1. AGORA O HOOK EXPORTA 'isLoading'
  // Adicione a desestruturação de isLoading:
  const { isAuthenticated, user, isLoading } = useAuth(); 

  // 2. GUARDA DE CARREGAMENTO (Solução para o F5/Recarregar)
  if (isLoading) {
    // Se o AuthProvider ainda está lendo o token do localStorage e definindo o estado,
    // nós esperamos. Isso evita o redirecionamento prematuro para a home.
    return <div>Carregando painel de acesso...</div>; 
  }

  // 3. VERIFICAÇÃO FINAL APÓS O CARREGAMENTO
  // Só renderiza a página se estiver logado E for entregador
  return isAuthenticated && user?.role === 'ENTREGADOR' ? (
    <Outlet />
  ) : (
    // Se não estiver autenticado ou a role estiver errada (após o loading), redireciona.
    <Navigate to="/" replace />
  );
};