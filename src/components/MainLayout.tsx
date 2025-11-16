// src/components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
// Corrija este caminho se o seu LoginModal estiver em /pages/
import { LoginModal } from '../pages/LoginModal'; 

/**
 * Este componente é o "Layout Padrão" do Cliente.
 * Ele renderiza o Header (com o modal) e o conteúdo da página (Outlet).
 * As rotas de Admin NÃO usarão este layout.
 */
export const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <LoginModal />
      <main style={{ padding: '20px' }}>
        <Outlet /> {/* O conteúdo da rota (ex: HomePage) será renderizado aqui */}
      </main>
    </>
  );
};