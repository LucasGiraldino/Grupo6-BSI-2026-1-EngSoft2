import { Plus, Trash2, X } from 'lucide-react'
import { Categoria } from '../hooks/useAlimentosData'

interface AlimentosCategoriaModalProps {
  aberto: boolean
  categorias: Categoria[]
  novaCategoria: string
  onNovaCategoriaChange: (value: string) => void
  onCriarCategoria: (e: React.FormEvent) => void
  onExcluirCategoria: (id: number) => void
  onFechar: () => void
}

export default function AlimentosCategoriaModal({
  aberto,
  categorias,
  novaCategoria,
  onNovaCategoriaChange,
  onCriarCategoria,
  onExcluirCategoria,
  onFechar,
}: AlimentosCategoriaModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Categorias</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <form onSubmit={onCriarCategoria} className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Nome da categoria"
              value={novaCategoria}
              onChange={e => onNovaCategoriaChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            />
            <button type="submit" className="px-3 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
            </button>
          </form>
          <ul className="space-y-1 max-h-60 overflow-y-auto">
            {categorias.length === 0 ? (
              <li className="text-sm text-gray-400 text-center py-2">Nenhuma categoria cadastrada</li>
            ) : (
              categorias.map(c => (
                <li key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{c.nome}</span>
                  <button
                    onClick={() => onExcluirCategoria(c.id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}
