import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo, setCodigo] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (email && senha) {
        await axios.post('/auth/login', { email, senha });
        setStep(2);
      }
    } catch (err) {
      setErro('Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (email && senha && codigo) {
        const res = await axios.post('/auth/verify', { email, senha, codigo }, { responseType: 'text' });
        const token = res.data;
        if (token) {
          login(token); 
        }
      }
    } catch (err) {
      setErro('Código inválido ou expirado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">SIGAAC</h1>
          <p className="text-sm text-gray-500">Sistema Integrado de Gestão</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleLogin} className="mt-8 space-y-6 animate-fade-in">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
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
              {loading ? 'Aguarde...' : 'Entrar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="mt-8 space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-lg font-medium text-gray-900 mb-1">Verificação em Duas Etapas</h2>
              <p className="text-sm text-gray-500">
                Enviamos um código de 6 dígitos para<br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            <div>
              <label className="sr-only">Código de Verificação</label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors font-mono"
                placeholder="000000"
                required
              />
            </div>

            {erro && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || codigo.length < 6}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Verificando...' : 'Confirmar Código'}
              </button>
              
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                Voltar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
