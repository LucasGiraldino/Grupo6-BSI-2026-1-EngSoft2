import { Plus, Loader } from 'lucide-react'

interface AgendaAddFormProps {
  formData: string
  formHoraInicio: string
  formHoraFim: string
  salvando: boolean
  erroForm: string
  onDataChange: (value: string) => void
  onHoraInicioChange: (value: string) => void
  onHoraFimChange: (value: string) => void
  onAdicionar: (e: React.FormEvent) => void
}

export default function AgendaAddForm({
  formData,
  formHoraInicio,
  formHoraFim,
  salvando,
  erroForm,
  onDataChange,
  onHoraInicioChange,
  onHoraFimChange,
  onAdicionar,
}: AgendaAddFormProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
      <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Adicionar Horário
      </h4>
      <form onSubmit={onAdicionar} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
          <input
            type="date"
            value={formData}
            onChange={e => onDataChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hora Início</label>
          <input
            type="time"
            value={formHoraInicio}
            onChange={e => onHoraInicioChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hora Fim</label>
          <input
            type="time"
            value={formHoraFim}
            onChange={e => onHoraFimChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={salvando}
          className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {salvando && <Loader className="w-4 h-4 animate-spin" />}
          Adicionar
        </button>
      </form>
      {erroForm && (
        <p className="text-sm text-red-500 mt-3">{erroForm}</p>
      )}
    </div>
  )
}
