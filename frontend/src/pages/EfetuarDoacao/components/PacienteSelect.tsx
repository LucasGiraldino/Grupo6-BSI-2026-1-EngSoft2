import type { Paciente } from '../hooks/useEfetuarDoacaoData'

interface PacienteSelectProps {
  pacientes: Paciente[]
  value: number | ''
  onChange: (value: number | '') => void
}

export default function PacienteSelect({ pacientes, value, onChange }: PacienteSelectProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-700 mb-3">Beneficiário</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
          value={value}
          onChange={e => onChange(Number(e.target.value) || '')}
        >
          <option value="">Selecione o Paciente</option>
          {pacientes.map(p => (
            <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
          ))}
        </select>
      </div>
    </div>
  )
}
