import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { validarCpf, limparCpf, formatarCpf } from '../utils/cpf';
import { validarEmail } from '../utils/validators';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) { setErro('Nome é obrigatório'); return; }
    if (!email.trim()) { setErro('Email é obrigatório'); return; }
    if (!validarEmail(email)) { setErro('Email inválido'); return; }
    if (limparCpf(cpf).length !== 11) { setErro('CPF deve ter 11 dígitos'); return; }
    if (!validarCpf(cpf)) { setErro('CPF inválido. Verifique os dígitos.'); return; }
    if (senha.length < 6) { setErro('Senha deve ter no mínimo 6 caracteres'); return; }

    setLoading(true);
    try {
      const res = await axios.post('/auth/register', {
        nome: nome.trim(),
        email: email.trim(),
        cpf: limparCpf(cpf),
        senha,
      });
      localStorage.setItem('token', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      window.location.href = '/configuracoes';
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao cadastrar';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">SIGAAC</h1>
          <p className="text-sm text-gray-500">Primeiro acesso — cadastro do administrador</p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                value={formatarCpf(cpf)}
                onChange={e => setCpf(limparCpf(e.target.value))}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors font-mono"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              Já possui conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
