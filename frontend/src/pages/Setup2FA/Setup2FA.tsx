import { useSetup2FA } from './hooks/useSetup2FA'
import { PasswordStep } from './components/PasswordStep'
import QRCodeStep from './components/QRCodeStep'
import { VerifyStep } from './components/VerifyStep'
import { DoneStep } from './components/DoneStep'

export default function Setup2FAPage() {
  const {
    email,
    senha, setSenha,
    step, setStep,
    qrDataUrl,
    secret,
    codigo, setCodigo,
    erro, loading, mensagem,
    handlePasswordSubmit,
    handleVerifySubmit,
    handleDisable,
    navigate,
  } = useSetup2FA()

  if (!email) return null

  const stepTitles: Record<string, string> = {
    password: 'Confirme sua senha para continuar',
    qr: 'Escaneie o QR code com o Google Authenticator',
    verify: 'Digite o código gerado pelo aplicativo',
    done: 'Configuração concluída!',
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
          <h2 className="text-lg font-medium text-gray-900 mb-1">Autenticação de Dois Fatores</h2>
          <p className="text-sm text-gray-500">{stepTitles[step]}</p>
        </div>

        {step === 'password' && (
          <PasswordStep
            senha={senha}
            loading={loading}
            erro={erro}
            onSenhaChange={setSenha}
            onSubmit={handlePasswordSubmit}
          />
        )}

        {step === 'qr' && (
          <QRCodeStep
            qrDataUrl={qrDataUrl}
            secret={secret}
            erro={erro}
            onAvancar={() => setStep('verify')}
          />
        )}

        {step === 'verify' && (
          <>
            <VerifyStep
              codigo={codigo}
              loading={loading}
              erro={erro}
              onCodigoChange={setCodigo}
              onSubmit={handleVerifySubmit}
              onCancel={handleDisable}
            />
          </>
        )}

        {step === 'done' && (
          <DoneStep
            mensagem={mensagem}
            onVoltar={() => navigate('/configuracoes', { replace: true })}
          />
        )}
      </div>
    </div>
  )
}
