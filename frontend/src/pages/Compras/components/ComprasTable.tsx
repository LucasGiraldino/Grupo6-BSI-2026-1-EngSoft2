import { Pencil, Trash2, Loader } from 'lucide-react'
import { Compra } from '../hooks/useComprasData'

interface ComprasTableProps {
  compras: Compra[]
  carregando: boolean
  onEditar: (c: Compra) => void
  onExcluir: (id: number) => void
}

function totalCompra(itens: Compra['itens']) {
  return itens.reduce((acc, i) => acc + i.quantidade * i.preco, 0)
}

export default function ComprasTable({ compras, carregando, onEditar, onExcluir }: ComprasTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Itens</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Observações</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                Carregando...
              </td>
            </tr>
          ) : compras.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                Nenhuma compra registrada
              </td>
            </tr>
          ) : (
            compras.map(c => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {new Date(c.dataCompra).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-gray-600">{c.itens?.length ?? 0} item(s)</td>
                <td className="px-6 py-4 text-gray-600">
                  {c.itens ? totalCompra(c.itens).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                </td>
                <td className="px-6 py-4 text-gray-600">{c.observacoes ?? '-'}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(c)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExcluir(c.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
