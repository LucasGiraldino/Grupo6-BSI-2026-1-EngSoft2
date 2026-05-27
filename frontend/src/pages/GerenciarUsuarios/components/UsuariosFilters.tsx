const PERFIS = ['USUARIO', 'ADMIN']

interface UsuariosFiltersProps {
  filtroSearch: string
  filtroPerfil: string
  onSearchChange: (value: string) => void
  onPerfilChange: (value: string) => void
  onBuscar: () => void
  onLimpar: () => void
}

export default function UsuariosFilters({
  filtroSearch,
  filtroPerfil,
  onSearchChange,
  onPerfilChange,
  onBuscar,
  onLimpar,
}: UsuariosFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar por nome ou email..."
        value={filtroSearch}
        onChange={e => onSearchChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
      />
      <select
        value={filtroPerfil}
        onChange={e => onPerfilChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
      >
        <option value="">Todos</option>
        {PERFIS.map(p => (
          <option key={p} value={p}>{p}</option>
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
