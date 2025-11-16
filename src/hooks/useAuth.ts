import { useContext } from 'react';
// ==========================================================
// --- CORREÇÃO APLICADA AQUI ---
// ==========================================================
// 1. Importa o "cofre" (AuthContext) de onde ele está (AuthTypes)
import { AuthContext } from '../context/AuthTypes'; 
// 2. Importa o "contrato" (AuthContextType) de onde ele está (AuthTypes)
import type { AuthContextType } from '../context/AuthTypes'; 

/**
 * Este é o hook customizado que seus componentes (Header, ProtectedRoute, etc.)
 * irão usar para acessar os dados de autenticação.
 */
export const useAuth = (): AuthContextType => {
  
  // 3. Consome o "cofre"
  const context = useContext(AuthContext);

  // 4. Garante que o hook está sendo usado dentro de um <AuthProvider>
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  // 5. Retorna os dados com o TIPO correto.
  //    Este 'context' AGORA INCLUI 'isLoading' graças à atualização do tipo.
  return context;
};