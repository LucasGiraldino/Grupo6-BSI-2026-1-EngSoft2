import { Loader } from 'lucide-react'

interface ProfissionalSelectProps {
  profissionais: { id: number; usuario: { nome: string }; especialidade: string }[]
  profissionalId: string
  carregando: boolean
  onChange: (value: string) => void
}

export default function ProfissionalSelect({ profissionais, profissionalId, carregando, onChange }: ProfissionalSelectProps) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700">Profissional:</label>
      {carregando ? (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Loader className="w-4 h-4 animate-spin" />
          Carregando...
        </div>
      ) : (
        <select
          value={profissionalId}
          onChange={e => onChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] min-w-[250px]"
        >
          <option value="">Selecione um profissional</option>
          {profissionais.map(p => (
            <option key={p.id} value={p.id}>{p.usuario?.nome} - {p.especialidade}</option>
          ))}
        </select>
      )}
    </div>
  )
}
