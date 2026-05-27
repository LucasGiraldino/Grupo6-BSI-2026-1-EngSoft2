import { Trash2 } from 'lucide-react'

interface ConsultasDeleteModalProps {
  aberto: boolean
  onConfirmar: () => void
  onVoltar: () => void
}

export default function ConsultasDeleteModal({ aberto, onConfirmar, onVoltar }: ConsultasDeleteModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cancelar consulta</h3>
            <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onVoltar}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Cancelar Consulta
          </button>
        </div>
      </div>
    </div>
  )
}
