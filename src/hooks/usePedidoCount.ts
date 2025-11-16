import { useContext, createContext } from 'react';
// 1. Importa os TIPOS do novo arquivo de Tipos
import type { PedidoCountContextType } from '../context/PedidoCountTypes';

// ==========================================================
// --- "COFRE" (CONTEXTO) CRIADO AQUI ---
// ==========================================================
// 2. O "Cofre" é criado e exportado para o Provedor usar
export const PedidoCountContext = createContext<PedidoCountContextType | undefined>(undefined);

/**
 * Este é o hook customizado que o Header e o CartPage
 * irão usar para acessar a contagem de pedidos.
 */
export const usePedidoCount = (): PedidoCountContextType => {
  
  // 3. Consome o contexto
  const context = useContext(PedidoCountContext);

  if (context === undefined) {
    throw new Error('usePedidoCount deve ser usado dentro de um PedidoCountProvider');
  }

  // 4. Retorna os dados do contexto
  return context;
};