// src/components/RestauranteRoute.tsx

import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Este componente protege as rotas do Painel do Restaurante.
 * 1. Checa se o usuário está logado.
 * 2. Checa se o usuário tem a role 'RESTAURANTE' (ou 'ADMIN').
 *
 * Se ambos forem verdadeiros, mostra a página do painel.
 * Se não, redireciona para a página inicial (Home).
 */
export const RestauranteRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // 1. Espera o AuthProvider terminar de carregar
  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;
  }

  // 2. Checa se está logado E se tem a role correta
  const isRestauranteOuAdmin = 
    isAuthenticated && 
    user && 
    (user.role === 'RESTAURANTE' || user.role === 'ADMIN');

  if (!isRestauranteOuAdmin) {
    // Se não for um restaurante ou admin, chuta ele para a Home
    // (Não abrimos o modal, pois clientes não devem tentar acessar o admin)
    return <Navigate to="/" replace />;
  }

  // 3. Se passou, mostra a página do painel (ex: /admin/pedidos)
  return <Outlet />;
};