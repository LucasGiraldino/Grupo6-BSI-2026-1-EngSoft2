import { X } from 'lucide-react'
import { ReceitaFormState } from '../hooks/useReceitasForm'
import type { Prontuario, Medico } from '../../../types'

interface ReceitasFormModalProps {
  aberto: boolean
  form: ReceitaFormState
  prontuarioId: string
  medicoId: string
  erroForm: string
  prontuarios: Prontuario[]
  medicos: Medico[]
  onFormChange: (form: ReceitaFormState) => void
  onProntuarioIdChange: (value: string) => void
  onMedicoIdChange: (value: string) => void
  onSalvar: (e: React.FormEvent) => void
  onFechar: () => void
}

export default function ReceitasFormModal({
  aberto,
  form,
  prontuarioId,
  medicoId,
  erroForm,
  prontuarios,
  medicos,
  onFormChange,
  onProntuarioIdChange,
  onMedicoIdChange,
  onSalvar,
  onFechar,
}: ReceitasFormModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Receita' : 'Nova Receita'}</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prontuário</label>
              <select
                required
                value={prontuarioId}
                onChange={e => onProntuarioIdChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              >
                <option value="">Selecione o prontuário</option>
                {prontuarios.map(p => (
                  <option key={p.id} value={p.id}>
                    #{p.id} — {p.paciente?.nome ?? `Paciente #${p.paciente?.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
              <select
                required
                value={medicoId}
                onChange={e => onMedicoIdChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              >
                <option value="">Selecione o médico</option>
                {medicos.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.usuario?.nome ?? `Médico #${m.id}`} ({m.crm})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão</label>
                <input
                  type="datetime-local"
                  required
                  value={form.dataEmissao}
                  onChange={e => onFormChange({ ...form, dataEmissao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                <input
                  type="date"
                  required
                  value={form.dataValidade}
                  onChange={e => onFormChange({ ...form, dataValidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                required
                rows={4}
                value={form.descricao}
                onChange={e => onFormChange({ ...form, descricao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
                placeholder="Descreva a prescrição médica..."
              />
            </div>
            {erroForm && (
              <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
            )}
          </div>
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
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
