import { useEsqueciSenha } from './hooks/useEsqueciSenha'
import { EmailForm } from './components/EmailForm'
import { ResetForm } from './components/ResetForm'

export default function EsqueciSenhaPage() {
  const {
    etapa, email, setEmail,
    codigoRevelado,
    codigo, setCodigo,
    novaSenha, setNovaSenha,
    confirmarSenha, setConfirmarSenha,
    erro, sucesso, loading,
    handleSolicitarCodigo,
    handleResetarSenha,
    navigate,
  } = useEsqueciSenha()

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
          <EmailForm
            email={email}
            loading={loading}
            erro={erro}
            onEmailChange={setEmail}
            onEnviar={handleSolicitarCodigo}
            onVoltar={() => navigate('/login')}
          />
        ) : (
          <ResetForm
            codigoRevelado={codigoRevelado}
            codigo={codigo}
            novaSenha={novaSenha}
            confirmarSenha={confirmarSenha}
            loading={loading}
            erro={erro}
            onCodigoChange={setCodigo}
            onNovaSenhaChange={setNovaSenha}
            onConfirmarSenhaChange={setConfirmarSenha}
            onResetar={handleResetarSenha}
            onVoltar={() => navigate('/login')}
          />
        )}
      </div>
    </div>
  )
}
