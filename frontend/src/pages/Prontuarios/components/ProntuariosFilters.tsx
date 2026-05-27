import { Search } from 'lucide-react'

interface ProntuariosFiltersProps {
  filtro: string
  onFiltroChange: (value: string) => void
  onBuscar: () => void
  onLimpar: () => void
}

export default function ProntuariosFilters({ filtro, onFiltroChange, onBuscar, onLimpar }: ProntuariosFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nome, CPF ou ID do prontuário..."
          value={filtro}
          onChange={e => onFiltroChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onBuscar()}
          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
        />
      </div>
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
