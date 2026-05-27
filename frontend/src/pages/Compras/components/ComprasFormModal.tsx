import { Plus, X } from 'lucide-react'
import { ComprasFormState } from '../hooks/useComprasForm'
import { formatarMoeda } from '../../../utils/validators'

interface ComprasFormModalProps {
  aberto: boolean
  form: ComprasFormState
  itens: { alimento: { id: number }; quantidade: string; preco: string }[]
  erroForm: string
  alimentos: { id: number; nome: string; unidadeMedida: string }[]
  onFormChange: (form: ComprasFormState) => void
  onAtualizarItem: (index: number, campo: string, valor: string | { id: number }) => void
  onAdicionarItem: () => void
  onRemoverItem: (index: number) => void
  onSalvar: (e: React.FormEvent) => void
  onFechar: () => void
}

export default function ComprasFormModal({
  aberto,
  form,
  itens,
  erroForm,
  alimentos,
  onFormChange,
  onAtualizarItem,
  onAdicionarItem,
  onRemoverItem,
  onSalvar,
  onFechar,
}: ComprasFormModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Compra' : 'Nova Compra'}</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Compra</label>
                <input
                  type="datetime-local"
                  required
                  value={form.dataCompra}
                  onChange={e => onFormChange({ ...form, dataCompra: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <input
                  type="text"
                  placeholder="Opcional"
                  value={form.observacoes}
                  onChange={e => onFormChange({ ...form, observacoes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Itens</label>
                <button
                  type="button"
                  onClick={onAdicionarItem}
                  className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                >
                  <Plus className="w-3 h-3" />
                  Adicionar item
                </button>
              </div>
              <div className="space-y-2">
                {itens.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <select
                      required
                      value={item.alimento.id || ''}
                      onChange={e => onAtualizarItem(index, 'alimento', { id: parseInt(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    >
                      <option value="">Selecione o alimento</option>
                      {alimentos.map(a => (
                        <option key={a.id} value={a.id}>{a.nome}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="0.001"
                      step="0.001"
                      placeholder="Qtd"
                      value={item.quantidade}
                      onChange={e => onAtualizarItem(index, 'quantidade', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Preço"
                      value={item.preco ? formatarMoeda(Number(item.preco) / 100) : ''}
                      onChange={e => onAtualizarItem(index, 'preco', e.target.value.replace(/\D/g, ''))}
                      className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemoverItem(index)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {erroForm && (
              <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
            )}
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onFechar}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
