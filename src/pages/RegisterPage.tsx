// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- 1. ESTADO PARA O USUÁRIO ---
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');

  // --- 2. ESTADO PARA O ENDEREÇO (COM NOMES CORRIGIDOS) ---
  const [rua, setRua] = useState(''); // <-- 'logradouro' mudou para 'rua'
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState(''); // <-- 'uf' mudou para 'estado'
  const [cep, setCep] = useState('');
  const [apelido, setApelido] = useState(''); // <-- CAMPO ADICIONADO

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }
    
    setLoading(true);

    // --- 3. MONTAR O OBJETO CORRETO (DTO) ---
    // Nomes atualizados para bater com o EnderecoDTO.java
    const registerRequest = {
      nome,
      email,
      senha: password, 
      cpf,
      telefone,
      endereco: { 
        rua, // <-- CORRIGIDO
        numero,
        complemento: complemento || null, 
        bairro,
        cidade,
        estado: estado.toUpperCase(), // <-- CORRIGIDO
        cep,
        apelido // <-- ADICIONADO
      }
    };

    try {
      // URL correta (já tínhamos)
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerRequest),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        // Pega os erros de validação (como o que você recebeu)
        if (errorData.details) {
            const messages = Object.values(errorData.details).join(', ');
            throw new Error(messages);
        }
        throw new Error(errorData.message || 'Falha no cadastro. Verifique os dados.');
      }

      // Sucesso!
      navigate('/login', { 
        state: { message: 'Cadastro realizado com sucesso! Faça o login.' } 
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  // (Estilos)
  const styles = {
    container: { padding: '20px', maxWidth: '500px', margin: 'auto', border: '1px solid #ddd', borderRadius: '8px' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px' },
    input: { width: '100%', padding: '8px', boxSizing: 'border-box' },
    button: { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
    error: { color: 'red', marginBottom: '10px' },
    link: { marginTop: '15px', textAlign: 'center' },
    heading: { borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '20px' }
  } as const;

  return (
    <div style={styles.container}>
      <h2>Criar Conta</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={styles.error}>{error}</p>}
        
        {/* --- 4. FORMULÁRIO COMPLETO (COM NOMES CORRIGIDOS) --- */}
        <h3 style={styles.heading}>Dados Pessoais</h3>
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
        
        <h3 style={styles.heading}>Dados de Acesso</h3>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Senha:</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="confirmPassword" style={styles.label}>Confirmar Senha:</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={styles.input} />
        </div>
        
        <h3 style={styles.heading}>Endereço de Entrega</h3>
         <div style={styles.formGroup}>
          {/* CAMPO ADICIONADO */}
          <label htmlFor="apelido" style={styles.label}>Apelido do Endereço (ex: Casa):</label>
          <input id="apelido" type="text" value={apelido} onChange={(e) => setApelido(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="cep" style={styles.label}>CEP:</label>
          <input id="cep" type="text" value={cep} onChange={(e) => setCep(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          {/* CAMPO CORRIGIDO (htmlFor e id) */}
          <label htmlFor="rua" style={styles.label}>Rua (Logradouro):</label>
          <input id="rua" type="text" value={rua} onChange={(e) => setRua(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="numero" style={styles.label}>Número:</label>
          <input id="numero" type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required style={styles.input} />
        </div>
         <div style={styles.formGroup}>
          <label htmlFor="complemento" style={styles.label}>Complemento (Opcional):</label>
          <input id="complemento" type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="bairro" style={styles.label}>Bairro:</label>
          <input id="bairro" type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="cidade" style={styles.label}>Cidade:</label>
          <input id="cidade" type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          {/* CAMPO CORRIGIDO (htmlFor e id) */}
          <label htmlFor="estado" style={styles.label}>Estado (UF):</label>
          <input id="estado" type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required maxLength={2} style={styles.input} />
        </div>

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </button>
      </form>
      <p style={styles.link}>
        Já tem uma conta? <Link to="/login">Faça o login</Link>
      </p>
    </div>
  );
};