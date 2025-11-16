import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CartContext, type CartItem, type CartContextType } from './CartTypes';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [itens, setItens] = useState<CartItem[]>([]);

  // (useEffect de carregar do LocalStorage... OK)
  useEffect(() => {
    const storedCart = localStorage.getItem('deliveryAppCart');
    if (storedCart) {
      setItens(JSON.parse(storedCart));
    }
  }, []);

  // (useEffect de salvar no LocalStorage... OK)
  useEffect(() => {
    localStorage.setItem('deliveryAppCart', JSON.stringify(itens));
  }, [itens]);

  // ==========================================================
  // --- CORREÇÃO DO BUG "MÚLTIPLOS RESTAURANTES" ---
  // ==========================================================
  const addItem = (item: Omit<CartItem, 'cartItemId'>) => {
    
    setItens((prevItens) => {
      // 1. Verifica se o carrinho NÃO está vazio
      if (prevItens.length > 0) {
        // 2. Pega o ID do restaurante que JÁ ESTÁ no carrinho
        const restauranteAtualId = prevItens[0].restauranteId;
        
        // 3. Verifica se o NOVO item é de um restaurante DIFERENTE
        if (item.restauranteId !== restauranteAtualId) {
          // 4. ALERTA O USUÁRIO E LIMPA O CARRINHO
          alert("Você só pode adicionar itens de um restaurante por vez. Seu carrinho antigo foi esvaziado.");
          
          // O novo carrinho conterá APENAS o novo item
          const cartItemId = `${item.produtoId}-[${item.opcionaisIds.sort().join(',')}]`;
          return [{ ...item, cartItemId }];
        }
      }

      // Se o carrinho estava vazio OU o restaurante é o mesmo:
      // (Lógica antiga de adicionar/incrementar)
      const cartItemId = `${item.produtoId}-[${item.opcionaisIds.sort().join(',')}]`;
      const itemExistente = prevItens.find(i => i.cartItemId === cartItemId);

      if (itemExistente) {
        return prevItens.map(i =>
          i.cartItemId === cartItemId
            ? { ...i, quantidade: i.quantidade + item.quantidade }
            : i
        );
      } else {
        return [...prevItens, { ...item, cartItemId }];
      }
    });
  };
  // ==========================================================
  // FIM DA CORREÇÃO
  // ==========================================================

  // (Função clearCart... OK)
  const clearCart = () => {
    setItens([]); 
  };

  // (Cálculos de total... OK)
  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);
  const valorTotal = itens.reduce((total, item) => 
    total + (item.precoUnitario * item.quantidade), 0
  );

  const value: CartContextType = {
    itens,
    addItem,
    clearCart,
    totalItens,
    valorTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};