import { X, Clock, Trash2, Loader } from 'lucide-react'
import { Paciente, AgendaDisponivel, Consulta } from '../hooks/useConsultasData'
import { TIPOS_CONSULTA } from '../../../types/consultaType'

interface ConsultasFormModalProps {
  aberto: boolean
  editandoId: number | null
  modalSlot: AgendaDisponivel | null
  modalTriagem: Consulta | null
  formPaciente: string
  formTipo: string
  formObs: string
  formStatus: string
  erroForm: string
  salvando: boolean
  pacientes: Paciente[]
  onFormPacienteChange: (v: string) => void
  onFormTipoChange: (v: string) => void
  onFormObsChange: (v: string) => void
  onFormStatusChange: (v: string) => void
  onSalvar: (e: React.FormEvent) => void
  onFechar: () => void
  onCancelar: () => void
}

export default function ConsultasFormModal({
  aberto,
  editandoId,
  modalSlot,
  modalTriagem,
  formPaciente,
  formTipo,
  formObs,
  formStatus,
  erroForm,
  salvando,
  pacientes,
  onFormPacienteChange,
  onFormTipoChange,
  onFormObsChange,
  onFormStatusChange,
  onSalvar,
  onFechar,
  onCancelar,
}: ConsultasFormModalProps) {
  if (!aberto) return null

  function formatarHora(hora: string) {
    return hora ? hora.substring(0, 5) : ''
  }

  function formatarData(d: string | undefined) {
    if (!d) return '-'
    const [ano, mes, dia] = d.substring(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editandoId ? 'Editar Consulta' : modalTriagem ? 'Agendar da Triagem' : 'Nova Consulta'}
          </h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="p-5 space-y-4">
          {modalTriagem ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                {modalTriagem.paciente.nome}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
              <select
                required
                value={formPaciente}
                onChange={e => onFormPacienteChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              >
                <option value="">Selecione o paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Consulta</label>
            <select
              required
              value={formTipo}
              onChange={e => onFormTipoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            >
              <option value="">Selecione o tipo</option>
              {TIPOS_CONSULTA.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea
              rows={2}
              value={formObs}
              onChange={e => onFormObsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
              placeholder="Observações sobre a consulta..."
            />
          </div>

          {editandoId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formStatus}
                onChange={e => onFormStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              >
                <option value="AGENDADA">Agendada</option>
                <option value="CONCLUIDA">Concluída</option>
                <option value="CANCELADA">Cancelada</option>
              </select>
            </div>
          )}

          {modalSlot && (
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatarData(modalSlot.data)} — {formatarHora(modalSlot.horaInicio)} às {formatarHora(modalSlot.horaFim)}
            </div>
          )}

          {erroForm && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
          )}

          <div className="flex gap-3 pt-2">
            {editandoId && (
              <button
                type="button"
                onClick={onCancelar}
                className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Cancelar
              </button>
            )}
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={salvando || !formTipo || (!modalTriagem && !formPaciente)}
              className="flex-1 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {salvando && <Loader className="w-4 h-4 animate-spin" />}
              {modalTriagem ? 'Confirmar Agendamento' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
