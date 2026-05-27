interface QRCodeStepProps {
  qrDataUrl: string
  secret: string
  erro: string
  onAvancar: () => void
}

export default function QRCodeStep({ qrDataUrl, secret, erro, onAvancar }: QRCodeStepProps) {
  return (
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
        onClick={onAvancar}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] transition-colors"
      >
        Já escaneei o QR code
      </button>
    </div>
  )
}
