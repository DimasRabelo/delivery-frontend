import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// === 1. DEFINIÇÕES DE TIPO (MANTIDAS) ===
interface Restaurante {
  id: number;
  nome: string;
  categoria: string;
  taxaEntrega: number;
  ativo: boolean;
}

interface PagedResponse<T> {
  content: T[];
}

interface ApiErrorResponse {
  message: string;
  error: string;
  status: number;
}

// === 2. "TYPE GUARDS" (MANTIDOS) ===
function isPagedResponse(data: unknown): data is PagedResponse<Restaurante> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'content' in data &&
    Array.isArray((data as PagedResponse<Restaurante>).content)
  );
}

function isErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    'status' in data
  );
}

// === 3. O COMPONENTE (AJUSTADO) ===

export const HomePage = () => {
  const { user, logout } = useAuth();
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // 🔑 VARIÁVEL CRÍTICA: Checa se é entregador logado
  const isEntregador = user?.role === 'ENTREGADOR';

  useEffect(() => {
    // Se for Entregador, cancela a busca por restaurantes e finaliza o loading
    if (isEntregador) {
        setLoading(false);
        // Não retorna nada, apenas finaliza o useEffect para esta execução
        return; 
    }
    
    // Se não for Entregador, executa a busca normalmente
    const fetchRestaurantes = async () => {
      try {
        const response = await fetch('/api/restaurantes');
        const data: unknown = await response.json();

        if (!response.ok) {
          if (isErrorResponse(data)) {
            throw new Error(data.message);
          }
          throw new Error('Falha ao buscar restaurantes (resposta não-OK)');
        }
        
        if (isPagedResponse(data)) {
          // O TypeScript agora verá 'restaurantes' como o tipo correto
          setRestaurantes(data.content); 
        } else {
          throw new Error('Formato de dados inesperado recebido do servidor');
        }

      } catch (err) {
        if (err instanceof Error) {
          setErro(err.message);
        } else {
          setErro('Ocorreu um erro desconhecido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantes();
    // A lista de dependências agora inclui isEntregador para re-rodar se o usuário fizer login/logout
  }, [isEntregador]); 

  // (O JSX (HTML) ajustado para a condicional do botão)
  return (
    <div>
      
      {/* ========================================================== */}
      {/* 🔑 BOTÃO CONDICIONAL PARA O ENTREGADOR (UX)                 */}
      {/* ========================================================== */}
      {isEntregador && (
          <div style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
              <Link to="/entregador/painel" style={{ 
                  color: '#007bff', 
                  textDecoration: 'none', 
                  fontSize: '16px',
                  fontWeight: 'bold'
              }}>
                  ← Voltar para Painel do Entregador
              </Link>
          </div>
      )}
      
      <h1>Bem-vindo, {user?.nome || 'Visitante'}!</h1>
      <p>Você está logado como: {user?.email} (Role: {user?.role})</p>
      <button onClick={logout}>Sair (Logout)</button>
      
      <hr style={{ margin: '20px 0' }} />

      <h2>Restaurantes Disponíveis</h2>
      {/* CRÍTICO: Se for Entregador, mostre uma mensagem em vez de carregar a lista */}
      {isEntregador && <p>Você está logado como entregador. Use o link acima para acessar seu painel.</p>}
      
      {loading && <p>Carregando restaurantes...</p>}
      
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      {/* A lista de restaurantes só aparece se NÃO for Entregador */}
      {!isEntregador && (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {restaurantes.map((rest) => (
              <li key={rest.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <Link to={`/restaurante/${rest.id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                  <strong style={{ fontSize: '1.2em' }}>{rest.nome}</strong>
                </Link>
                ({rest.categoria})
                <br />
                Taxa de Entrega: R$ {rest.taxaEntrega.toFixed(2)}
              </li>
            ))}
          </ul>
      )}
    </div>
  );
};