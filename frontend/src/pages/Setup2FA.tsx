import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import QRCode from 'qrcode';

export default function Setup2FA() {
  const navigate = useNavigate();
  const { email } = useAuth();
  const [senha, setSenha] = useState('');
  const [step, setStep] = useState<'password' | 'qr' | 'verify' | 'done'>('password');
  const [secret, setSecret] = useState('');
  const [, setProvisioningUri] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true });
    }
  }, [email, navigate]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/2fa/setup', { email, senha });
      const { secret: newSecret, provisioningUri: uri } = res.data;
      setSecret(newSecret);
      setProvisioningUri(uri);
      const dataUrl = await QRCode.toDataURL(uri, { width: 250, margin: 2 });
      setQrDataUrl(dataUrl);
      setStep('qr');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao iniciar configuração');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/2fa/verify-setup', { email, senha, codigo });
      setMensagem(res.data.message);
      setStep('done');
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setErro('');
    setLoading(true);
    try {
      const res = await axios.post('/auth/2fa/disable', { email, senha });
      setMensagem(res.data.message);
      navigate('/configuracoes', { replace: true });
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao desativar 2FA');
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 mb-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Autenticação de Dois Fatores</h2>
          <p className="text-sm text-gray-500">
            {step === 'password' && 'Confirme sua senha para continuar'}
            {step === 'qr' && 'Escaneie o QR code com o Google Authenticator'}
            {step === 'verify' && 'Digite o código gerado pelo aplicativo'}
            {step === 'done' && 'Configuração concluída!'}
          </p>
        </div>

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sua senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
            {erro && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !senha}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Aguarde...' : 'Continuar'}
            </button>
          </form>
        )}

        {step === 'qr' && (
          <div className="mt-8 space-y-6">
            {qrDataUrl && (
              <div className="flex justify-center">
                <img src={qrDataUrl} alt="QR Code para Google Authenticator" className="rounded-lg border border-gray-200" />
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500 mb-2">Ou digite manualmente a chave:</p>
              <p className="text-sm font-mono font-bold text-gray-800 tracking-wider select-all">{secret}</p>
            </div>
            {erro && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}
            <button
              onClick={() => setStep('verify')}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] transition-colors"
            >
              Já escaneei o QR code
            </button>
          </div>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código do Google Authenticator
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors font-mono"
                placeholder="000000"
                required
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
            <button
              type="submit"
              disabled={loading || codigo.length < 6}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verificando...' : 'Confirmar e Ativar'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="mt-8 space-y-6">
            {mensagem && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-sm text-green-700">{mensagem}</p>
              </div>
            )}
            <button
              onClick={() => navigate('/configuracoes', { replace: true })}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] transition-colors"
            >
              Voltar para Configurações
            </button>
          </div>
        )}

        {step === 'verify' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleDisable}
              disabled={loading}
              className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
            >
              Cancelar configuração
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
