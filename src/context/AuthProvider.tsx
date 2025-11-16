import React, { useState, useEffect, useCallback } from 'react';

// ==========================================================
// --- CORREÇÃO AQUI: Adicionamos 'type' antes de User ---
// ==========================================================
import { AuthContext, type User } from './AuthTypes'; 

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Começa TRUE para segurar a renderização das rotas protegidas
  const [isLoading, setIsLoading] = useState(true); 
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Ao iniciar, tenta recuperar a sessão
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Erro ao restaurar sessão", e);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    // Finaliza o carregamento
    setIsLoading(false); 
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout,
      isLoginModalOpen,
      openLoginModal: () => setIsLoginModalOpen(true),
      closeLoginModal: () => setIsLoginModalOpen(false)
    }}>
      {children}
    </AuthContext.Provider>
  );
};