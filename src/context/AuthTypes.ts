import { createContext } from 'react';

// 1. Definição do Usuário (Agora com restauranteId)
export interface User {
  id: number;
  nome: string;
  email: string;
  role: string;
  // Campo opcional: só existe se for restaurante
  restauranteId?: number; 
}

// 2. Definição do Contexto (Agora com isLoading)
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Variável crítica para o F5 não deslogar
  isLoading: boolean; 
  
  login: (token: string, user: User) => void;
  logout: () => void;

  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// 3. Criação do Contexto Vazio
export const AuthContext = createContext<AuthContextType | undefined>(undefined);