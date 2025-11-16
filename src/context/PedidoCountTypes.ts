// 1. Interface (O "Contrato" deste novo cofre)
export interface PedidoCountContextType {
  pedidosCount: number;
  refreshPedidosCount: () => Promise<void>;
}

// 2. Interface (Resposta da API de contagem)
export interface ContagemResponse {
    success: boolean;
    data: { contagem: number };
}