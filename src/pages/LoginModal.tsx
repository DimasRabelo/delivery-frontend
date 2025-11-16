// src/pages/LoginModal.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// Estilos básicos (sem alterações)
const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '20px 30px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    position: 'relative',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#888',
  }
} as const;

export const LoginModal: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  
  const { login, isLoginModalOpen, closeLoginModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoginModalOpen) {
      setEmail('');
      setSenha('');
      setErro(null);
    }
  }, [isLoginModalOpen]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }
      
      // 1. Salva no contexto (Token + Dados do Usuário)
      login(data.token, data.usuario); 
      
      // 2. Fecha o modal imediatamente para limpar a tela
      closeLoginModal();               

      // =========================================================
      // --- 3. O "CÉREBRO" DO ROTEAMENTO POR ROLE ---
      // =========================================================
      const userRole = data.usuario.role; // Certifique-se que o back retorna 'role'

      switch (userRole) {
        case 'RESTAURANTE':
          // Redireciona para o Painel Administrativo
          navigate('/admin/pedidos');
          break;

        case 'ENTREGADOR':
          // Redireciona para o Painel do Entregador (Vamos criar em breve)
          navigate('/entregador/painel'); 
          break;

        case 'ADMIN':
          // Redireciona para Dashboard do Sistema
          navigate('/sistema/dashboard');
          break;

        case 'CLIENTE':
        default:
          // Cliente: Apenas fecha o modal (já feito acima) e fica onde estava
          // ou se quiser forçar ir para a home: navigate('/');
          break;
      }
      // =========================================================
      
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(String(error));
      }
    }
  };

  const handleRegisterClick = () => {
    closeLoginModal(); 
    navigate('/register'); 
  };

  if (!isLoginModalOpen) {
    return null;
  }

  return (
    <div style={styles.backdrop} onClick={closeLoginModal}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={closeLoginModal}>&times;</button>
        
        <h1>Delivery API - Login</h1>
        
        {erro && (
          <pre style={{ color: 'red', background: '#ffeeee', padding: '10px', whiteSpace: 'pre-wrap' }}>
            {erro}
          </pre>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email: </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Senha: </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>Entrar</button>
        </form>

        <p style={{ marginTop: '15px', textAlign: 'center' }}>
          Não tem uma conta? 
          <button 
            onClick={handleRegisterClick} 
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px' }}
          >
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};