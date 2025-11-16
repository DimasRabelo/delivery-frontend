// src/pages/MeuPerfilPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const MeuPerfilPage: React.FC = () => {
  const { user, token } = useAuth(); 

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !token) return;

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        const clienteResponse = await fetch(`/api/clientes/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!clienteResponse.ok) {
          throw new Error('Falha ao buscar dados do perfil.');
        }

        const clienteData = await clienteResponse.json();
        const perfil = clienteData.data; 
        
        setNome(perfil.nome);
        setCpf(perfil.cpf);
        setTelefone(perfil.telefone);
        
        setEmail(user.email);

      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('Erro desconhecido ao carregar perfil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, token]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (!user || !token) {
      setError('Você não está autenticado.');
      setSaving(false);
      return;
    }

    try {
      const apiCalls = [];

      // A. Prepara a chamada para ATUALIZAR CLIENTE (nome, cpf, tel)
      const clienteDto = { nome, cpf, telefone };
      apiCalls.push(
        fetch(`/api/clientes/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(clienteDto),
        })
      );

      // B. Prepara a chamada para ATUALIZAR USUÁRIO (email)
      const usuarioDto = { email };
      apiCalls.push(
        fetch(`/api/usuarios/${user.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(usuarioDto),
        })
      );

      const responses = await Promise.all(apiCalls);

      for (const res of responses) {
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Falha ao salvar. Verifique os dados.');
        }
      }
      
      setSuccess('Perfil atualizado com sucesso!');
      // TODO: Atualizar o 'user' no AuthContext se o email mudou

    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro desconhecido ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  // (Estilos do seu RegisterPage, para consistência)
  const styles = {
    container: { padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px' },
    // --- CORREÇÃO AQUI ---
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '10px' },
    success: { color: 'green', marginBottom: '10px' },
    heading: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '20px' }
  // --- E AQUI ---
  } as const;

  return (
    <div style={styles.container}>
      <h2>Meu Perfil</h2>
      <p>Aqui você pode atualizar seus dados pessoais e de acesso.</p>
      
      <form onSubmit={handleSubmit}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <h3 style={styles.heading}>Dados Pessoais (Perfil)</h3>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Nome:</label>
          <input id="name" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="cpf" style={styles.label}>CPF:</label>
          <input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="telefone" style={styles.label}>Telefone:</label>
          <input id="telefone" type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} required style={styles.input} />
        </div>
        
        <h3 style={styles.heading}>Dados de Acesso (Login)</h3>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>
        
        <button type="submit" disabled={saving} style={styles.button}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};