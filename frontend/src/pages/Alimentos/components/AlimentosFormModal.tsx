import { X, Settings2 } from 'lucide-react'
import { AlimentoFormState } from '../hooks/useAlimentosForm'
import { Categoria } from '../hooks/useAlimentosData'

const UNIDADES = ['KG', 'G', 'L', 'ML', 'UNIDADE', 'CAIXA', 'PACOTE']

interface AlimentosFormModalProps {
  aberto: boolean
  form: AlimentoFormState
  erroForm: string
  categorias: Categoria[]
  onFormChange: (form: AlimentoFormState) => void
  onAbrirCategoriaModal: () => void
  onSalvar: (e: React.FormEvent) => void
  onFechar: () => void
}

export default function AlimentosFormModal({
  aberto,
  form,
  erroForm,
  categorias,
  onFormChange,
  onAbrirCategoriaModal,
  onSalvar,
  onFechar,
}: AlimentosFormModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Alimento' : 'Novo Alimento'}</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              required
              placeholder="Arroz"
              value={form.nome}
              onChange={e => onFormChange({ ...form, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <div className="flex gap-2">
              <select
                required
                value={form.categoriaId}
                onChange={e => onFormChange({ ...form, categoriaId: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={onAbrirCategoriaModal}
                title="Gerenciar categorias"
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              rows={2}
              placeholder="Descrição do alimento"
              value={form.descricao}
              onChange={e => onFormChange({ ...form, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
              <select
                required
                value={form.unidadeMedida}
                onChange={e => onFormChange({ ...form, unidadeMedida: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              >
                <option value="">Selecione...</option>
                {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
              <input
                type="date"
                value={form.dataVencimento}
                onChange={e => onFormChange({ ...form, dataVencimento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
          </div>
          {erroForm && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
          )}
          <div className="flex gap-3 pt-2">
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
