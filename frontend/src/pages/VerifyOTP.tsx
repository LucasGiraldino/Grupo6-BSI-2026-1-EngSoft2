import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  const senha = (location.state as any)?.senha || '';

  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email || !senha) {
      navigate('/login', { replace: true });
    }
  }, [email, senha, navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/verify', { email, senha, codigo });
      const accessToken = res.data?.accessToken;
      const refreshToken = res.data?.refreshToken;
      if (!accessToken) {
        setErro('Resposta inválida do servidor.');
        return;
      }
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      navigate('/pacientes', { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Código inválido ou expirado';
      setErro(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!email || !senha) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Verificação em Duas Etapas</h2>
          <p className="text-sm text-gray-500">
            Enviamos um código de 6 dígitos para <strong>{email}</strong>
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-6">
          <div>
            <label className="sr-only">Código de Verificação</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors font-mono"
              placeholder="000000"
              required
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              autoFocus
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
              onClick={() => navigate('/login', { replace: true })}
              className="w-full text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              Voltar ao login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
