interface UsuariosDeleteModalProps {
  aberto: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function UsuariosDeleteModal({ aberto, onConfirmar, onCancelar }: UsuariosDeleteModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Desativar Usuário</h4>
        <p className="text-sm text-gray-600 mb-6">
          Tem certeza que deseja desativar este usuário? Ele não poderá mais acessar o sistema.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Desativar
          </button>
        </div>
      </div>
    </div>
  )
}
