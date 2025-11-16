import './App.css';
import { Routes, Route } from 'react-router-dom';

// --- IMPORTS DOS COMPONENTES DE ROTEAMENTO ---
import { RoleRoute } from './components/RoleRoute'; // (Mantido)
import { ProtectedRoute } from './components/ProtectedRoute';
import { EntregadorRoute } from './components/EntregadorRoute';
import { RestauranteRoute } from './components/RestauranteRoute'; 
import { MainLayout } from './components/MainLayout';


// --- IMPORTS DAS PÁGINAS ---

import { LoginPage } from './pages/LoginPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage'; 
import { MeusPedidosPage } from './pages/MeusPedidosPage';
import { PedidoDetailPage } from './pages/PedidoDetailPage'; 
import { RegisterPage } from './pages/RegisterPage';
import { MeuPerfilPage } from './pages/MeuPerfilPage';
import { MeusEnderecosPage } from './pages/MeusEnderecosPage';
import { EntregadorPainelPage } from './pages/EntregadorPainelPage';
import { RestauranteLoginPage } from './pages/RestauranteLoginPage';
import { RestaurantePedidosPage } from './pages/RestaurantePedidosPage'; 


// --- IMPORTS DOS PROVIDERS ---
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import { PedidoCountProvider } from './context/PedidoCountProvider'; 


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <PedidoCountProvider>
          
          <Routes>
            
            {/* ========================================================== */}
            {/* 1. ÁREA DO RESTAURANTE (ADMIN)                             */}
            {/* ========================================================== */}
            <Route path="/admin/login" element={<RestauranteLoginPage />} />
            <Route element={<RestauranteRoute />}>
              <Route path="/admin/pedidos" element={<RestaurantePedidosPage />} />
            </Route>

            {/* ========================================================== */}
            {/* 2. ÁREA DO ENTREGADOR                                      */}
            {/* ========================================================== */}
            <Route element={<EntregadorRoute />}>
               <Route path="/entregador/painel" element={<EntregadorPainelPage />} />
            </Route>

            {/* ========================================================== */}
            {/* 3. ÁREA DO CLIENTE E ROTAS GERAIS (MAIN LAYOUT)            */}
            {/* ========================================================== */}
            <Route element={<MainLayout />}>
              
              {/* 🔑 CORREÇÃO: A ROTA PRINCIPAL (/) AGORA USA O RoleRoute */}
              {/* O RoleRoute verificará a Role e redirecionará Entregador/Restaurante,
                 ou renderizará a HomePage para Clientes/Deslogados. */}
              <Route path="/" element={<RoleRoute />} />
              
              <Route path="/restaurante/:restauranteId" element={<RestaurantDetailPage />} />
              <Route path="/restaurante/:restauranteId/produto/:produtoId" element={<ProductDetailPage />} />
              <Route path="/carrinho" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/meus-pedidos" element={<MeusPedidosPage />} />
                <Route path="/pedidos/:id" element={<PedidoDetailPage />} /> 
                <Route path="/meu-perfil" element={<MeuPerfilPage />} />
                <Route path="/meus-enderecos" element={<MeusEnderecosPage />} />
              </Route>
            </Route>

          </Routes>

        </PedidoCountProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;