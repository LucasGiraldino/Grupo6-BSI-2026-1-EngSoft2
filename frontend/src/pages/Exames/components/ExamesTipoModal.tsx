import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

interface ExamesTipoModalProps {
  aberto: boolean
  tiposExame: { id: number; nome: string; descricao?: string; ativo: boolean }[]
  onCriarTipo: (nome: string, descricao: string | null) => Promise<void>
  onExcluirTipo: (id: number) => Promise<void>
  onFechar: () => void
}

export default function ExamesTipoModal({ aberto, tiposExame, onCriarTipo, onExcluirTipo, onFechar }: ExamesTipoModalProps) {
  const [novoTipoNome, setNovoTipoNome] = useState('')
  const [novoTipoDesc, setNovoTipoDesc] = useState('')

  if (!aberto) return null

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    if (!novoTipoNome.trim()) return
    await onCriarTipo(novoTipoNome.trim(), novoTipoDesc.trim() || null)
    setNovoTipoNome('')
    setNovoTipoDesc('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tipos de Exame</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <form onSubmit={handleCriar} className="space-y-2">
            <input
              type="text"
              required
              placeholder="Nome do tipo de exame"
              value={novoTipoNome}
              onChange={e => setNovoTipoNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Descrição (opcional)"
                value={novoTipoDesc}
                onChange={e => setNovoTipoDesc(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
              <button type="submit" className="px-3 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
          <ul className="space-y-1 max-h-60 overflow-y-auto">
            {tiposExame.length === 0 ? (
              <li className="text-sm text-gray-400 text-center py-2">Nenhum tipo cadastrado</li>
            ) : (
              tiposExame.map(t => (
                <li key={t.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                  <div>
                    <span className="text-sm text-gray-700">{t.nome}</span>
                    {t.descricao && <span className="text-xs text-gray-400 ml-2">{t.descricao}</span>}
                  </div>
                  <button
                    onClick={() => onExcluirTipo(t.id)}
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
