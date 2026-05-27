export function ResetForm({
  codigoRevelado,
  codigo,
  novaSenha,
  confirmarSenha,
  loading,
  erro,
  onCodigoChange,
  onNovaSenhaChange,
  onConfirmarSenhaChange,
  onResetar,
  onVoltar,
}: {
  codigoRevelado: string
  codigo: string
  novaSenha: string
  confirmarSenha: string
  loading: boolean
  erro: string
  onCodigoChange: (value: string) => void
  onNovaSenhaChange: (value: string) => void
  onConfirmarSenhaChange: (value: string) => void
  onResetar: (e: React.FormEvent) => void
  onVoltar: () => void
}) {
  return (
    <form onSubmit={onResetar} className="mt-8 space-y-6">
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
          onChange={e => onCodigoChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
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
          onChange={e => onNovaSenhaChange(e.target.value)}
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
          onChange={e => onConfirmarSenhaChange(e.target.value)}
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
          onClick={onVoltar}
          className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          ← Voltar ao login
        </button>
      </div>
    </form>
  )
}
