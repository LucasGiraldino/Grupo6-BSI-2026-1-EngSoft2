import type { EstoqueItem } from '../hooks/useEfetuarDoacaoData'

interface CestaFormProps {
  estoque: EstoqueItem[]
  alimentoSelecionadoId: number | ''
  quantidadeInput: string
  onAlimentoChange: (value: number | '') => void
  onQuantidadeChange: (value: string) => void
  onAdicionar: () => void
}

export default function CestaForm({
  estoque,
  alimentoSelecionadoId,
  quantidadeInput,
  onAlimentoChange,
  onQuantidadeChange,
  onAdicionar,
}: CestaFormProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-base font-semibold text-gray-700 mb-3">Cesta de Alimentos</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mantimento</label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
          value={alimentoSelecionadoId}
          onChange={e => onAlimentoChange(Number(e.target.value) || '')}
        >
          <option value="">Selecione o Item</option>
          {estoque.map(item => (
            <option key={item.id} value={item.alimento.id}>
              {item.alimento.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
        <input
          type="number"
          placeholder="Ex: 5"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
          value={quantidadeInput}
          onChange={e => onQuantidadeChange(e.target.value)}
        />
      </div>

      <button
        type="button"
        onClick={onAdicionar}
        className="w-full px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity mt-2"
      >
        Adicionar mantimento
      </button>
    </div>
  )
}
