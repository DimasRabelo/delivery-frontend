import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
// 'useAuth' foi removido, pois o fetch agora é público
import { useCart } from '../hooks/useCart';

// === INTERFACES (Completas) ===
interface ItemOpcional {
  id: number;
  nome: string;
  precoAdicional: number;
}
interface GrupoOpcional {
  id: number;
  nome: string;
  minSelecao: number;
  maxSelecao: number;
  itensOpcionais: ItemOpcional[]; 
}
interface Product {
  id: number;
  nome: string;
  descricao: string;
  precoBase: number;
  disponivel: boolean;
  restauranteId: number; 
}
interface ProductDetail extends Product {
  gruposOpcionais: GrupoOpcional[];
}
interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  message: string;
}
interface ApiErrorResponse {
  message: string;
  error: string;
  status: number;
}

// === TYPE GUARDS (Completos) ===
function isProductDetailResponse(data: unknown): data is ApiResponseWrapper<ProductDetail> {
  return (
    typeof data === 'object' && data !== null && 'success' in data &&
    'data' in data && (data as ApiResponseWrapper<ProductDetail>).data !== null &&
    'gruposOpcionais' in (data as ApiResponseWrapper<ProductDetail>).data
  );
}
function isErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' && data !== null && 'message' in data && 'status' in data
  );
}

// === O COMPONENTE (ATUALIZADO E COMPLETO) ===
export const ProductDetailPage = () => {
  const { restauranteId, produtoId } = useParams<{ restauranteId: string; produtoId: string }>();
  // 'token' foi removido
  const { addItem } = useCart(); 
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [opcionaisSelecionados, setOpcionaisSelecionados] = useState<Record<number, boolean>>({});
  const [quantidade, setQuantidade] = useState(1);
  const [precoTotalItem, setPrecoTotalItem] = useState(0);

  // (Fetch... CORRIGIDO para ser público)
  useEffect(() => {
    const fetchProductDetails = async () => {
      // 1. Verificação do 'token' REMOVIDA
      if (!produtoId) return; 
      try {
        setLoading(true);
        // 2. 'headers' com 'Authorization' REMOVIDO
        const response = await fetch(`/api/produtos/${produtoId}`);
        
        const data: unknown = await response.json();
        if (!response.ok) {
          // 3. Corrigido o erro de tipo (seu type guard estava certo, eu o omiti)
          if (isErrorResponse(data)) { throw new Error(data.message); }
          throw new Error('Falha ao buscar detalhes do produto');
        }
        if (isProductDetailResponse(data)) {
          // 4. Corrigido o erro de tipo (seu type guard estava certo)
          setProduct(data.data); 
          setPrecoTotalItem(data.data.precoBase); 
        } else {
          throw new Error('Formato de dados inesperado');
        }
      } catch (err) {
        if (err instanceof Error) { setErro(err.message); }
        else { setErro('Ocorreu um erro desconhecido'); }
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  // 5. Dependência do 'token' REMOVIDA
  }, [produtoId]); 

  // (Lógica de Seleção de Opcionais... COMPLETA)
  const handleOpcionalChange = (
    itemOpcional: ItemOpcional, 
    grupo: GrupoOpcional
  ) => {
    setOpcionaisSelecionados((prevSelecionados) => {
      const novosSelecionados = { ...prevSelecionados };
      const itemId = itemOpcional.id;

      if (grupo.maxSelecao === 1) {
        grupo.itensOpcionais.forEach(item => {
          novosSelecionados[item.id] = false;
        });
        novosSelecionados[itemId] = true;
      } else {
        novosSelecionados[itemId] = !novosSelecionados[itemId];
      }
      
      const contagemNesteGrupo = Object.keys(novosSelecionados).filter(key => 
        novosSelecionados[Number(key)] === true && 
        grupo.itensOpcionais.some(item => item.id === Number(key)) 
      ).length;

      if (contagemNesteGrupo > grupo.maxSelecao) {
         alert(`Seleção máxima excedida para '${grupo.nome}'. Máximo: ${grupo.maxSelecao}`);
         novosSelecionados[itemId] = false;
      }
      return novosSelecionados;
    });
  };

  // (Lógica de Cálculo de Preço... COMPLETA)
  useEffect(() => {
    if (!product) return;
    let precoCalculado = product.precoBase;
    Object.keys(opcionaisSelecionados).forEach(key => {
      if (opcionaisSelecionados[Number(key)]) { 
        product.gruposOpcionais.forEach(grupo => {
          const item = grupo.itensOpcionais.find(i => i.id === Number(key));
          if (item) {
            precoCalculado += item.precoAdicional;
          }
        });
      }
    });
    setPrecoTotalItem(precoCalculado);
  }, [product, opcionaisSelecionados]);


  // (Lógica de Adicionar ao Carrinho... COMPLETA)
  const handleAddToCart = () => {
    // 6. Corrigido o meu erro de digitação 'restanteId' -> 'restauranteId'
    if (!product || !restauranteId) return;
    
    for (const grupo of product.gruposOpcionais) {
      const contagemNesteGrupo = Object.keys(opcionaisSelecionados).filter(key => 
        opcionaisSelecionados[Number(key)] === true &&
        grupo.itensOpcionais.some(item => item.id === Number(key))
      ).length;
      if (contagemNesteGrupo < grupo.minSelecao) {
        alert(`Seleção obrigatória para '${grupo.nome}'. Mínimo: ${grupo.minSelecao}`);
        return; 
      }
    }

    const idsSelecionados = Object.keys(opcionaisSelecionados)
      .filter(key => opcionaisSelecionados[Number(key)] === true)
      .map(Number);
    
    const itemParaAdicionar = {
      produtoId: product.id,
      produtoNome: product.nome,
      quantidade: quantidade,
      precoUnitario: precoTotalItem,
      opcionaisIds: idsSelecionados,
      restauranteId: Number(restauranteId) 
    };

    addItem(itemParaAdicionar);
    alert(`${product.nome} (Qtd: ${quantidade}) adicionado ao carrinho!`);
  };

  // (Handler de Quantidade... COMPLETO)
  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let novaQtde = parseInt(e.target.value);
    if (novaQtde < 1) novaQtde = 1; 
    if (novaQtde > 20) novaQtde = 20; 
    setQuantidade(novaQtde);
  };
  
  const backLink = restauranteId ? `/restaurante/${restauranteId}` : "/";

  // (JSX / HTML... COMPLETO)
  return (
    <div>
      <Link to={backLink} style={{ color: '#007bff', textDecoration: 'none' }}>
        &larr; Voltar ao Cardápio
      </Link>

      {loading && <p>Carregando produto...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {product && (
        <div>
          <h2 style={{ marginTop: '20px' }}>{product.nome}</h2>
          <p>{product.descricao}</p>
          <strong>Preço Base: R$ {product.precoBase.toFixed(2)}</strong>

          <hr style={{ margin: '20px 0' }} />

          <h3>Opcionais:</h3>
          
          {product.gruposOpcionais.map((grupo) => (
            <div key={grupo.id} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px' }}>
              <strong>{grupo.nome}</strong> (Mín: {grupo.minSelecao}, Máx: {grupo.maxSelecao})
              <ul>
                {grupo.itensOpcionais.map((item) => (
                  <li key={item.id}>
                    <input 
                      type={grupo.maxSelecao === 1 ? 'radio' : 'checkbox'}
                      id={`item-${item.id}`}
                      name={`grupo-${grupo.id}`}
                      checked={opcionaisSelecionados[item.id] || false}
                      onChange={() => handleOpcionalChange(item, grupo)}
                    />
                    <label htmlFor={`item-${item.id}`}>
                      {item.nome} (+ R$ {item.precoAdicional.toFixed(2)})
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <hr />
          
          <div style={{ margin: '20px 0' }}>
            <label htmlFor="quantidade" style={{ marginRight: '10px', fontWeight: 'bold' }}>
              Quantidade:
            </label>
            <input 
              type="number" 
              id="quantidade"
              value={quantidade}
              onChange={handleQuantidadeChange}
              min="1"
              max="20"
              style={{ width: '60px', padding: '5px', fontSize: '1em' }}
            />
          </div>
          
          <div style={{ fontSize: '1.2em', fontWeight: 'bold', margin: '20px 0' }}>
            Total do Item: R$ {(precoTotalItem * quantidade).toFixed(2)}
          </div>
          
          <button 
            onClick={handleAddToCart}
            style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', fontSize: '1.1em', cursor: 'pointer' }}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      )}
    </div>
  );
};