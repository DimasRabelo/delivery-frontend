import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthProvider.tsx';
import { CartProvider } from './context/CartProvider.tsx'; 
import { BrowserRouter } from 'react-router-dom';

// 1. IMPORTE O NOVO PROVEDOR
import { PedidoCountProvider } from './context/PedidoCountProvider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* 2. "ENVOLVA" O CARTPROVIDER E O APP COM O NOVO PROVEDOR */}
        {/* (Ele deve ficar DENTRO do AuthProvider) */}
        <PedidoCountProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </PedidoCountProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)