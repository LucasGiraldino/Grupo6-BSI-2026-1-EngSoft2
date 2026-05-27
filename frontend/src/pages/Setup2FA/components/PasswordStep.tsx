export function PasswordStep({
  senha,
  loading,
  erro,
  onSenhaChange,
  onSubmit,
}: {
  senha: string
  loading: boolean
  erro: string
  onSenhaChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Sua senha</label>
        <input
          type="password"
          value={senha}
          onChange={e => onSenhaChange(e.target.value)}
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
  )
}
