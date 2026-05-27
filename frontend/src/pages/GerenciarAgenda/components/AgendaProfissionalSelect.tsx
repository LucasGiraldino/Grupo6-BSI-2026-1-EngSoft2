interface AgendaProfissionalSelectProps {
  profissionalId: string
  profissionais: { id: number; usuario: { nome: string }; especialidade: string }[]
  onChange: (value: string) => void
}

export default function AgendaProfissionalSelect({ profissionalId, profissionais, onChange }: AgendaProfissionalSelectProps) {
  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-gray-700 mr-3">Profissional:</label>
      <select
        value={profissionalId}
        onChange={e => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] min-w-[300px]"
      >
        <option value="">Selecione um profissional</option>
        {profissionais.map(p => (
          <option key={p.id} value={p.id}>{p.usuario?.nome} - {p.especialidade}</option>
        ))}
      </select>
    </div>
  )
}
