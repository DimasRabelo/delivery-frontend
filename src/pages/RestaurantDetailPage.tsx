import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 

// === 1. DEFINIÇÕES DE TIPO ===

interface Product {
  id: number;
  nome: string;
  descricao: string;
  precoBase: number; 
  disponivel: boolean;
}

// O formato da sua resposta de SUCESSO (ApiResponseWrapper)
interface ApiResponseWrapper<T> {
  success: boolean;
  data: T; // <-- A LISTA ESTÁ AQUI DENTRO
  message: string;
}

// O formato da sua resposta de ERRO
interface ApiErrorResponse {
  message: string;
  error: string;
  status: number;
}

// === 2. "TYPE GUARDS" ===

function isApiResponse(data: unknown): data is ApiResponseWrapper<Product[]> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    'data' in data &&
    Array.isArray((data as ApiResponseWrapper<Product[]>).data)
  );
}

function isErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' && data !== null && 'message' in data && 'status' in data
  );
}

// === 3. O COMPONENTE ===

export const RestaurantDetailPage = () => {
  // ==========================================================
  // --- CORREÇÃO 1: Usar 'restauranteId' (vindo da rota) ---
  // ==========================================================
  const { restauranteId } = useParams<{ restauranteId: string }>(); 

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  // (O console.log de teste foi removido daqui)
  
  useEffect(() => {
    const fetchProducts = async () => {
      // ==========================================================
      // --- CORREÇÃO 2: Checar a variável correta ---
      // ==========================================================
      if (!restauranteId) return; // Checa se 'restauranteId' existe

      try {
        setLoading(true); 
        
        // ==========================================================
        // --- CORREÇÃO 3: Usar a variável correta no fetch ---
        // ==========================================================
        const response = await fetch(`/api/restaurantes/${restauranteId}/produtos`);
        const data: unknown = await response.json();

        if (!response.ok) {
          if (isErrorResponse(data)) { throw new Error(data.message); }
          throw new Error('Falha ao buscar produtos');
        }
        
        if (isApiResponse(data)) {
          setProducts(data.data); 
        } else {
          throw new Error('Formato de dados inesperado (não é um ApiResponseWrapper)');
        }

      } catch (err) {
        if (err instanceof Error) { setErro(err.message); }
        else { setErro('Ocorreu um erro desconhecido'); }
      } finally {
        setLoading(false); 
      }
    };

    fetchProducts();
    
    // ==========================================================
    // --- CORREÇÃO 4: Usar a variável correta na dependência ---
    // ==========================================================
  }, [restauranteId]); 

  return (
    <div>
      <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
        &larr; Voltar para Restaurantes
      </Link>
      
      {/* ========================================================== */}
      {/* --- CORREÇÃO 5: Usar a variável correta no título --- */}
      {/* ========================================================== */}
      <h2 style={{ marginTop: '20px' }}>Cardápio do Restaurante (ID: {restauranteId})</h2>

      {loading && <p>Carregando cardápio...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <div style={{ marginTop: '20px' }}>
        {products.map((prod) => (
          <div key={prod.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
            
            {/* ========================================================== */}
            {/* --- CORREÇÃO 6: Usar a variável correta no Link --- */}
            {/* ========================================================== */}
            <Link to={`/restaurante/${restauranteId}/produto/${prod.id}`} style={{ textDecoration: 'none', color: '#006400' }}>
              <strong style={{ fontSize: '1.1em' }}>{prod.nome}</strong>
            </Link>
            
            - R$ {prod.precoBase.toFixed(2)} 
            <p style={{ fontSize: '0.9em', color: '#555' }}>{prod.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
};