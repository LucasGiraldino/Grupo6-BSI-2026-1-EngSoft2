import { Medico } from '../../../types'

interface TriagemFiltersProps {
  filtroPacienteNome: string
  filtroMedicoId: string
  medicos: Medico[]
  onPacienteNomeChange: (value: string) => void
  onMedicoIdChange: (value: string) => void
  onBuscar: () => void
  onLimpar: () => void
}

export default function TriagemFilters({
  filtroPacienteNome,
  filtroMedicoId,
  medicos,
  onPacienteNomeChange,
  onMedicoIdChange,
  onBuscar,
  onLimpar,
}: TriagemFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar por nome do paciente..."
        value={filtroPacienteNome}
        onChange={e => onPacienteNomeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
      />
      <select
        value={filtroMedicoId}
        onChange={e => onMedicoIdChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
      >
        <option value="">Todos os médicos</option>
        {medicos.map(m => (
          <option key={m.id} value={m.id}>{m.usuario?.nome ?? `CRM ${m.crm}`}</option>
        ))}
      </select>
      <button
        onClick={onBuscar}
        className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        Buscar
      </button>
      <button
        onClick={onLimpar}
        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
      >
        Limpar
      </button>
    </div>
  )
}
