import { Pencil, Trash2, Loader } from 'lucide-react'
import { Triagem } from '../../../types'

interface TriagemTableProps {
  triagens: Triagem[]
  carregando: boolean
  onEditar: (t: Triagem) => void
  onExcluir: (id: number) => void
}

function formatarDataHora(d: string | undefined) {
  if (!d) return '-'
  return new Date(d).toLocaleString('pt-BR')
}

export default function TriagemTable({ triagens, carregando, onEditar, onExcluir }: TriagemTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médico</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pressão</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Febre</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cond. Clínica</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                Carregando...
              </td>
            </tr>
          ) : triagens.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                Nenhuma triagem cadastrada
              </td>
            </tr>
          ) : (
            triagens.map(t => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{t.prontuario?.paciente?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{t.medico?.usuario?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{formatarDataHora(t.dataTriagem)}</td>
                <td className="px-6 py-4 text-gray-600">{t.pressaoArterial ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{t.febre != null ? `${t.febre}°C` : '-'}</td>
                <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{t.condicaoClinica}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(t)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExcluir(t.id)}
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
