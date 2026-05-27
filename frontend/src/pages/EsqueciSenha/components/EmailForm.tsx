export function EmailForm({
  email,
  loading,
  erro,
  onEmailChange,
  onEnviar,
  onVoltar,
}: {
  email: string
  loading: boolean
  erro: string
  onEmailChange: (value: string) => void
  onEnviar: (e: React.FormEvent) => void
  onVoltar: () => void
}) {
  return (
    <form onSubmit={onEnviar} className="mt-8 space-y-6">
      <p className="text-sm text-gray-600">
        Digite seu email cadastrado para receber o código de recuperação.
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          onChange={e => onEmailChange(e.target.value)}
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
          onClick={onVoltar}
          className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          ← Voltar ao login
        </button>
      </div>
    </form>
  )
}
