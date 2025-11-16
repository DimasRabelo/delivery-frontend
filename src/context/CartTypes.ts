import { createContext } from 'react';

/**
 * Define a estrutura de um único item dentro do carrinho de compras.
 */
export interface CartItem {
  /**
   * ID único para o item no carrinho (gerado pelo frontend).
   * Ex: "produtoId-opcionalId1-opcionalId2" (ex: "3-[14,10]")
   */
  cartItemId: string; 
  
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  
  /**
   * O preço final da unidade (Preço Base + soma dos Opcionais).
   */
  precoUnitario: number; 
  
  opcionaisIds: number[];
  
  /**
   * (Opcional) Usado para exibir os nomes dos opcionais no carrinho.
   */
  opcionaisNomes?: string[]; 
  
  /**
   * O ID do restaurante ao qual este item pertence.
   * (Importante para evitar que o usuário misture pedidos de lojas diferentes).
   */
  restauranteId: number; 
}

/**
 * Define o que o "cofre" (Context) do carrinho vai guardar e quais
 * funções ele vai expor para o resto do app.
 */
export interface CartContextType {
  /**
   * A lista atual de itens no carrinho.
   */
  itens: CartItem[];
  
  /**
   * Função para adicionar um item (ou incrementar a quantidade) ao carrinho.
   */
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  
  /**
   * Função para limpar o carrinho (remover todos os itens).
   */
  clearCart: () => void;
  
  /**
   * O número total de itens no carrinho (soma das quantidades).
   */
  totalItens: number;
  
  /**
   * O valor total em R$ (soma de (precoUnitario * quantidade)).
   */
  valorTotal: number;
}

/**
 * Cria o Context (o "cofre" em si).
 * Os componentes "Provedor" e "Consumidor" usarão isso.
 */
const defaultCartContext: CartContextType = {
  itens: [],
  addItem: () => {},
  clearCart: () => {},
  totalItens: 0,
  valorTotal: 0,
};

export const CartContext = createContext<CartContextType>(defaultCartContext);
