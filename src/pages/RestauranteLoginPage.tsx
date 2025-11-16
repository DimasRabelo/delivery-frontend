// src/pages/RestauranteLoginPage.tsx

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

// Estilos
const styles = {
    container: { padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px', marginTop: '50px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' }, 
    button: { width: '100%', padding: '10px' },
    error: { color: 'red', marginBottom: '10px' }
} as const;

export const RestauranteLoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  
  const { login, isAuthenticated, user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErro(null);

    try {
      // 🔑 CORREÇÃO CRÍTICA: Mudar o endpoint para o dedicado
      const response = await fetch('/api/auth/login-restaurante', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();
      if (!response.ok) {
        // Se a API retornou 401/403 (e a API já tem a guarda de Role invertida), 
        // ele cai aqui com a mensagem customizada ("Acesso negado: Este endpoint é exclusivo...")
        throw new Error(data.message || 'Erro ao fazer login');
      }
      
      // Se a API retornou 200 OK, é porque a Role é RESTAURANTE ou ADMIN (verificação do Backend)
      
      // Salva a sessão
      login(data.token, data.usuario);
      
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro(String(error));
      }
    }
  };

  // Se o usuário JÁ ESTIVER logado como Restaurante/Admin, redireciona.
  if (isAuthenticated && (user?.role === 'RESTAURANTE' || user?.role === 'ADMIN')) {
    return <Navigate to="/admin/pedidos" replace />; 
  }

  return (
    <div style={styles.container}>
      <h2>Login do Restaurante</h2>
      <p>Acesse o painel de gerenciamento de pedidos.</p>
      
      {erro && <p style={styles.error}>{erro}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="senha" style={styles.label}>Senha:</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
};