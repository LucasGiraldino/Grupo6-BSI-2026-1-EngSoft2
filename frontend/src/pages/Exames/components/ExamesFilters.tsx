const STATUS_OPCOES = ['SOLICITADO', 'AGENDADO', 'REALIZADO', 'CANCELADO']

interface ExamesFiltersProps {
  filtroStatus: string
  filtroTipoExame: string
  onStatusChange: (value: string) => void
  onTipoExameChange: (value: string) => void
  onBuscar: () => void
  onLimpar: () => void
}

export default function ExamesFilters({
  filtroStatus,
  filtroTipoExame,
  onStatusChange,
  onTipoExameChange,
  onBuscar,
  onLimpar,
}: ExamesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <select
        value={filtroStatus}
        onChange={e => onStatusChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
      >
        <option value="">Todos</option>
        {STATUS_OPCOES.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Buscar por tipo de exame..."
        value={filtroTipoExame}
        onChange={e => onTipoExameChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
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
