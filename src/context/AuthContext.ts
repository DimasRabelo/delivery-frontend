// src/context/AuthContext.ts
import { createContext } from 'react';

// Definição do Usuário
export interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
}

// Definição do Contexto (com o loading incluso)
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean; // <--- O LOADING IMPORTANTE
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// Criação e Exportação do Contexto
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);