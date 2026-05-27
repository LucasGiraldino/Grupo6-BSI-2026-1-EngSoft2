interface PacienteFiltersProps {
  filtroNome: string
  filtroCpf: string
  onNomeChange: (value: string) => void
  onCpfChange: (value: string) => void
  onBuscar: () => void
  onLimpar: () => void
}

export default function PacienteFilters({
  filtroNome,
  filtroCpf,
  onNomeChange,
  onCpfChange,
  onBuscar,
  onLimpar,
}: PacienteFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar por nome..."
        value={filtroNome}
        onChange={e => onNomeChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
      />
      <input
        type="text"
        placeholder="Buscar por CPF..."
        value={filtroCpf}
        onChange={e => onCpfChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-48"
      />
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
