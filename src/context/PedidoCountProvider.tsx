// src/context/PedidoCountProvider.tsx

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
// Importamos o contexto do outro arquivo
import { PedidoCountContext } from './PedidoCountContext'; 

export const PedidoCountProvider = ({ children }: { children: React.ReactNode }) => {
  const [pedidosCount, setPedidosCount] = useState(0);
  
  const { token, isAuthenticated, user } = useAuth(); 

  const refreshPedidosCount = useCallback(async () => {
    if (!isAuthenticated || !token || user?.role !== 'CLIENTE') {
      setPedidosCount(0);
      return;
    }
    
    try {
      const response = await fetch('/api/pedidos/meus/contagem', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const json = await response.json();
        // Garante que é um número
        const numero = typeof json.data === 'number' ? json.data : 0;
        setPedidosCount(numero);
      } else {
         setPedidosCount(0);
      }
    } catch (error) {
      console.error("Erro ao buscar contagem:", error);
      setPedidosCount(0);
    }
  }, [token, isAuthenticated, user]);

  useEffect(() => {
    refreshPedidosCount();
    const interval = setInterval(refreshPedidosCount, 30000);
    return () => clearInterval(interval);
  }, [refreshPedidosCount]);

  const value = useMemo(() => ({
    pedidosCount,
    refreshPedidosCount
  }), [pedidosCount, refreshPedidosCount]);

  return (
    <PedidoCountContext.Provider value={value}>
      {children}
    </PedidoCountContext.Provider>
  );
};