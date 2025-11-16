// src/context/PedidoCountContext.ts
import { createContext, useContext } from 'react';

// Definição do Tipo
export interface PedidoCountContextType {
  pedidosCount: number;
  refreshPedidosCount: () => Promise<void>;
}

// 1. Criação do Contexto
export const PedidoCountContext = createContext<PedidoCountContextType>({} as PedidoCountContextType);

// 2. Criação do Hook (Separado do componente para o ESLint não reclamar)
export const usePedidoCount = () => useContext(PedidoCountContext);