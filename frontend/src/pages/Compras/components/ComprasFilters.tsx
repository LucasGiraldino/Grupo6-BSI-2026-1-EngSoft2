interface ComprasFiltersProps {
  filtroDataInicio: string
  filtroDataFim: string
  filtroObservacoes: string
  onDataInicioChange: (value: string) => void
  onDataFimChange: (value: string) => void
  onObservacoesChange: (value: string) => void
  onBuscar: () => void
  onLimpar: () => void
}

export default function ComprasFilters({
  filtroDataInicio,
  filtroDataFim,
  filtroObservacoes,
  onDataInicioChange,
  onDataFimChange,
  onObservacoesChange,
  onBuscar,
  onLimpar,
}: ComprasFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 mb-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Data Início</label>
        <input
          type="date"
          value={filtroDataInicio}
          onChange={e => onDataInicioChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Data Fim</label>
        <input
          type="date"
          value={filtroDataFim}
          onChange={e => onDataFimChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
        />
      </div>
      <input
        type="text"
        placeholder="Buscar observações..."
        value={filtroObservacoes}
        onChange={e => onObservacoesChange(e.target.value)}
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
