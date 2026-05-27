import { X } from 'lucide-react'
import { Prontuario } from '../hooks/useProntuariosData'

interface ProntuariosFormModalProps {
  aberto: boolean
  editando: Prontuario | null
  observacoes: string
  dataFechamento: string
  erroForm: string
  onObservacoesChange: (value: string) => void
  onDataFechamentoChange: (value: string) => void
  onSalvar: (e: React.FormEvent) => void
  onFechar: () => void
}

export default function ProntuariosFormModal({
  aberto,
  editando,
  observacoes,
  dataFechamento,
  erroForm,
  onObservacoesChange,
  onDataFechamentoChange,
  onSalvar,
  onFechar,
}: ProntuariosFormModalProps) {
  if (!aberto || !editando) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Prontuário #{editando.id} — {editando.paciente?.nome}
          </h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Abertura</span>
              <p className="text-sm text-gray-900 mt-0.5">
                {editando.dataAbertura ? new Date(editando.dataAbertura).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</span>
              <p className="text-sm text-gray-900 mt-0.5">
                {editando.dataFechamento ? 'Fechado' : 'Ativo'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fechamento</label>
            <input
              type="date"
              value={dataFechamento}
              onChange={e => onDataFechamentoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
            <textarea
              rows={5}
              value={observacoes}
              onChange={e => onObservacoesChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
              placeholder="Observações clínicas gerais do paciente..."
            />
          </div>

          {erroForm && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
