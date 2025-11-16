// src/pages/MeusEnderecosPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

// ... (interfaces continuam as mesmas) ...
interface EnderecoResponse {
  id: number;
  cep: string;
  rua: string; 
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string; 
  apelido: string;
}

interface EnderecoFormState {
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  apelido: string;
}

const initialState: EnderecoFormState = {
  cep: '',
  rua: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  apelido: '',
};

export const MeusEnderecosPage: React.FC = () => {
  const { token } = useAuth();
  const [enderecos, setEnderecos] = useState<EnderecoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formState, setFormState] = useState(initialState);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // --- (Funções fetchEnderecos, handleFormChange, handleFormSubmit, handleDelete... tudo igual) ---
  const fetchEnderecos = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null); 
    try {
      const response = await fetch('/api/enderecos/meus', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar endereços.');
      }
      const data: EnderecoResponse[] = await response.json();
      setEnderecos(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao carregar endereços.');
    } finally {
      setLoading(false);
    }
  }, [token]); 

  useEffect(() => {
    fetchEnderecos();
  }, [fetchEnderecos]); 

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const novoEnderecoDTO = {
      ...formState,
      estado: formState.estado.toUpperCase(), 
    };

    try {
      const response = await fetch('/api/enderecos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(novoEnderecoDTO),
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.errors) {
            const messages = errData.errors.map((err: { defaultMessage: string }) => err.defaultMessage).join(', ');
            throw new Error(messages);
        }
        throw new Error(errData.message || 'Falha ao salvar endereço.');
      }

      setFormState(initialState);
      fetchEnderecos(); 

    } catch (err) {
      if (err instanceof Error) setFormError(err.message);
      else setFormError('Erro desconhecido ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (enderecoId: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este endereço?")) {
      return;
    }
    setError(null); 
    try {
      const response = await fetch(`/api/enderecos/${enderecoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Falha ao excluir endereço.');
      }
      fetchEnderecos();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro desconhecido ao excluir.');
    }
  };


  // ==========================================================
  // --- CORREÇÃO DO LINTER APLICADA AQUI ---
  // ==========================================================
  const styles = {
    pageContainer: { display: 'flex', gap: '30px', maxWidth: '1200px', margin: 'auto' },
    listContainer: { flex: 1 },
    formContainer: { flex: 1, maxWidth: '450px' },
    // 1. Removido 'as 'relative'' daqui
    addressCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#f9f9f9', position: 'relative' }, 
    form: { border: '1px solid #ccc', borderRadius: '8px', padding: '20px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    // 2. O 'boxSizing' já estava correto
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' },
    error: { color: 'red', marginBottom: '10px' },
    heading: { borderBottom: '1px solid #eee', paddingBottom: '10px' },
    deleteButton: {
      // 3. Removido 'as 'absolute'' daqui
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      color: '#dc3545', // Vermelho
      cursor: 'pointer',
      fontSize: '1.2em',
      fontWeight: 'bold',
    }
  } as const; // <-- E o 'as const' final resolve tudo
  // ==========================================================
  // --- FIM DA CORREÇÃO ---
  // ==========================================================


  return (
    <div style={styles.pageContainer}>
      
      {/* Coluna da Lista de Endereços */}
      <div style={styles.listContainer}>
        <h2 style={styles.heading}>Meus Endereços</h2>
        {loading && <p>Carregando endereços...</p>}
        {error && <p style={styles.error}>{error}</p>}
        
        {!loading && enderecos.length === 0 && (
          <p>Você ainda não tem endereços cadastrados.</p>
        )}

        {enderecos.map(end => (
          <div key={end.id} style={styles.addressCard}>
            
            <button 
              onClick={() => handleDelete(end.id)} 
              style={styles.deleteButton}
              title="Excluir endereço"
            >
              &times;
            </button>
            
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
              {end.apelido}
            </h3>
            <p>
              {end.rua}, {end.numero} {end.complemento ? `- ${end.complemento}` : ''}
              <br />
              {end.bairro}, {end.cidade} - {end.estado}
              <br />
              CEP: {end.cep}
            </p>
          </div>
        ))}
      </div>

      {/* Coluna do Formulário de Novo Endereço */}
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Adicionar Novo Endereço</h2>
        <form onSubmit={handleFormSubmit} style={styles.form}>
          {formError && <p style={styles.error}>{formError}</p>}
          
          <div style={styles.formGroup}>
            <label htmlFor="apelido" style={styles.label}>Apelido (ex: Casa, Trabalho):</label>
            <input name="apelido" value={formState.apelido} onChange={handleFormChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="cep" style={styles.label}>CEP:</label>
            <input name="cep" value={formState.cep} onChange={handleFormChange} required style={styles.input} maxLength={8} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="rua" style={styles.label}>Rua:</label>
            <input name="rua" value={formState.rua} onChange={handleFormChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="numero" style={styles.label}>Número:</label>
            <input name="numero" value={formState.numero} onChange={handleFormChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="complemento" style={styles.label}>Complemento:</label>
            <input name="complemento" value={formState.complemento} onChange={handleFormChange} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="bairro" style={styles.label}>Bairro:</label>
            <input name="bairro" value={formState.bairro} onChange={handleFormChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="cidade" style={styles.label}>Cidade:</label>
            <input name="cidade" value={formState.cidade} onChange={handleFormChange} required style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="estado" style={styles.label}>Estado (UF):</label>
            <input name="estado" value={formState.estado} onChange={handleFormChange} required style={styles.input} maxLength={2} />
          </div>
          
          <button type="submit" disabled={saving} style={styles.button}>
            {saving ? 'Salvando...' : 'Salvar Endereço'}
          </button>
        </form>
      </div>

    </div>
  );
};