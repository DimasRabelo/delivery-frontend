import { useContext } from 'react';
// 1. CORREÇÃO: Removemos 'CartContextType' daqui.
//    O hook 'useContext' vai inferir o tipo do 'CartContext'.
import { CartContext } from '../context/CartTypes'; 

export const useCart = () => {
  // 2. O 'context' agora infere seu tipo automaticamente
  const context = useContext(CartContext); 
  
  if (context === undefined || context === null) {
    // Se tentarmos usar o carrinho fora do "provedor", isso vai falhar
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};