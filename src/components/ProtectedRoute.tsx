// --- 1. IMPORTAR 'useEffect' E 'useNavigate' ---
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
// 'Navigate' foi trocado por 'useNavigate'
import { Outlet, useNavigate } from 'react-router-dom'; 

/**
 * Este componente "protege" rotas.
 * Se o usuário estiver autenticado, ele renderiza o <Outlet /> (a página filha).
 * Se NÃO estiver:
 * 1. Abre o modal de login (via 'openLoginModal').
 * 2. Redireciona o usuário para a página inicial ('/').
 */
export const ProtectedRoute = () => {
  // --- 2. IMPORTAR 'openLoginModal' E CHAMAR 'useNavigate' ---
  const { isAuthenticated, isLoading, openLoginModal } = useAuth();
  const navigate = useNavigate();

  // --- 3. ADIÇÃO DE 'useEffect' PARA O REDIRECIONAMENTO ---
  // Usamos useEffect porque abrir um modal e navegar
  // são "efeitos colaterais", e não podem ser feitos
  // diretamente durante a renderização.
  useEffect(() => {
    // Se NÃO está carregando E NÃO está autenticado...
    if (!isLoading && !isAuthenticated) {
      openLoginModal(); // 👈 Ação 1: Abre o modal
      navigate('/', { replace: true }); // 👈 Ação 2: Redireciona para a Home
    }
  }, [isLoading, isAuthenticated, openLoginModal, navigate]); // Dependências do efeito


  // 4. CHECAGEM DE 'CARREGANDO' (Continua igual)
  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;
  }

  // ==========================================================
  // --- 5. LÓGICA DE RENDERIZAÇÃO SIMPLIFICADA ---
  // ==========================================================

  // Se NÃO está carregando E ESTÁ autenticado...
  // Mostra a página protegida (ex: /meus-pedidos)
  if (isAuthenticated) {
    return <Outlet />;
  }

  // Se NÃO está carregando E NÃO está autenticado...
  // O 'useEffect' acima já foi disparado e está cuidando
  // de abrir o modal e redirecionar.
  // Enquanto isso acontece, não renderizamos nada.
  return null;
};