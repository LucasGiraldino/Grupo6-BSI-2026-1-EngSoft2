export function DoneStep({
  mensagem,
  onVoltar,
}: {
  mensagem: string
  onVoltar: () => void
}) {
  return (
    <div className="mt-8 space-y-6">
      {mensagem && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-sm text-green-700">{mensagem}</p>
        </div>
      )}
      <button
        onClick={onVoltar}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] transition-colors"
      >
        Voltar para Configurações
      </button>
    </div>
  )
}
