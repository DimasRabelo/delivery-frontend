// src/pages/LoginPage.tsx

import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';

/**
 * A rota /login agora é apenas um "gatilho" para o modal.
 * 1. Se o usuário já está logado, manda ele para a Home.
 * 2. Se o usuário é convidado, ele abre o modal e manda para a Home.
 * O usuário nunca "vê" esta página.
 */
export const LoginPage = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Só roda se o usuário NÃO estiver logado
    if (!isAuthenticated) {
      openLoginModal(); // 👈 Abre o modal
      navigate('/', { replace: true }); // 👈 Manda o usuário para a Home
    }
  }, [isAuthenticated, openLoginModal, navigate]);

  // Se o usuário já estiver logado, manda para a Home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se o usuário não está logado, mostra um "Carregando"
  // enquanto o useEffect acima faz o redirecionamento.
  return <div style={{ padding: '20px', textAlign: 'center' }}>Redirecionando...</div>;
};