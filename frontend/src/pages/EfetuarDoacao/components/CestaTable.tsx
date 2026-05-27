import { Trash2 } from 'lucide-react'
import type { TabelaItem } from '../hooks/useEfetuarDoacaoForm'

interface CestaTableProps {
  cesta: TabelaItem[]
  dataDoacao: string
  observacoes: string
  mensagemErro: string
  onDataChange: (value: string) => void
  onObservacoesChange: (value: string) => void
  onRemoverItem: (idAlimento: number) => void
  onSalvar: () => void
}

export default function CestaTable({
  cesta,
  dataDoacao,
  observacoes,
  mensagemErro,
  onDataChange,
  onObservacoesChange,
  onRemoverItem,
  onSalvar,
}: CestaTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col h-full">
      <h3 className="text-base font-semibold text-gray-700 mb-3">Mantimentos Adicionados</h3>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantidade</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {cesta.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  Nenhum alimento adicionado à cesta.
                </td>
              </tr>
            ) : (
              cesta.map(item => (
                <tr key={item.idAlimento} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{item.idAlimento}</td>
                  <td className="px-6 py-4 text-gray-600">{item.nomeAlimento}</td>
                  <td className="px-6 py-4 text-gray-600">{item.quantidade} {item.unidadeMedida}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRemoverItem(item.idAlimento)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4 flex flex-col gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data Doação</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            value={dataDoacao}
            onChange={e => onDataChange(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
          <textarea
            placeholder="Escreva alguma observação aqui..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
            value={observacoes}
            onChange={e => onObservacoesChange(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {mensagemErro && (
        <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm mt-3">
          {mensagemErro}
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onSalvar}
          className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Salvar
        </button>
      </div>
    </div>
  )
}
