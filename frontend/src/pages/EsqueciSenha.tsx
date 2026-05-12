import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Etapa = 'email' | 'codigo';

export default function EsqueciSenha() {
  const navigate = useNavigate();

  const [etapa, setEtapa] = useState<Etapa>('email');
  const [email, setEmail] = useState('');
  const [emailEnviado, setEmailEnviado] = useState('');
  const [codigoRevelado, setCodigoRevelado] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setEmailEnviado(email);
      setCodigoRevelado(res.data.codigo || '');
      setEtapa('codigo');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao solicitar código');
    } finally {
      setLoading(false);
    }
  };

  const handleResetarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (novaSenha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não conferem');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/reset-password', {
        email: emailEnviado,
        codigo: codigo || codigoRevelado,
        novaSenha,
      });
      setSucesso('Senha redefinida com sucesso!');
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">SIGAAC</h1>
          <p className="text-sm text-gray-500">Redefinir senha</p>
        </div>

        {sucesso ? (
          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <p className="text-sm text-green-700">{sucesso}</p>
          </div>
        ) : etapa === 'email' ? (
          <form onSubmit={handleSolicitarCodigo} className="mt-8 space-y-6">
            <p className="text-sm text-gray-600">
              Digite seu email cadastrado para receber o código de recuperação.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {erro && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                ← Voltar ao login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetarSenha} className="mt-8 space-y-6">
            {codigoRevelado && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-2">
                  Código de recuperação (demonstração)
                </p>
                <p className="text-3xl font-mono font-bold text-green-800 tracking-[0.2em]">
                  {codigoRevelado}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
              <input
                type="text"
                value={codigo}
                onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-lg tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent"
                placeholder="000000"
                required
                inputMode="numeric"
                maxLength={6}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
              <input
                type="password"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent"
                placeholder="Repita a nova senha"
                required
                minLength={6}
              />
            </div>

            {erro && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !codigo || !novaSenha || !confirmarSenha}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Redefinindo...' : 'Redefinir Senha'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
              >
                ← Voltar ao login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
