export function VerifyStep({
  codigo,
  loading,
  erro,
  onCodigoChange,
  onSubmit,
  onCancel,
}: {
  codigo: string
  loading: boolean
  erro: string
  onCodigoChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Código do Google Authenticator
        </label>
        <input
          type="text"
          value={codigo}
          onChange={e => onCodigoChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Cancelar configuração
        </button>
      </div>
    </form>
  )
}
