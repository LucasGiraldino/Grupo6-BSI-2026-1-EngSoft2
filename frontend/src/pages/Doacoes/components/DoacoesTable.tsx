import { Pencil, Trash2, Loader } from 'lucide-react'
import { Doacao } from '../hooks/useDoacoesData'

interface DoacoesTableProps {
  doacoes: Doacao[]
  carregando: boolean
  onEditar: (d: Doacao) => void
  onExcluir: (id: number) => void
}

function formatarDataHora(d: string | undefined) {
  if (!d) return '-'
  return new Date(d).toLocaleString('pt-BR')
}

export default function DoacoesTable({ doacoes, carregando, onEditar, onExcluir }: DoacoesTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Profissional</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Itens</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                Carregando...
              </td>
            </tr>
          ) : doacoes.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                Nenhuma doação registrada
              </td>
            </tr>
          ) : (
            doacoes.map(d => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{d.id}</td>
                <td className="px-6 py-4 text-gray-600">{d.paciente?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{d.profissional?.usuario?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{formatarDataHora(d.dataDoacao)}</td>
                <td className="px-6 py-4 text-gray-600">{d.itens?.length ?? 0} item(ns)</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(d)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                      title="Visualizar detalhes"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExcluir(d.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                      title="Excluir"
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
