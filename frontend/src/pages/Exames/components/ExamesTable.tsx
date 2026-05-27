import { Pencil, Trash2, Loader } from 'lucide-react'
import { Exame } from '../hooks/useExamesData'

const STATUS_CORES: Record<string, string> = {
  SOLICITADO: 'bg-blue-100 text-blue-700',
  AGENDADO: 'bg-yellow-100 text-yellow-700',
  REALIZADO: 'bg-green-100 text-green-700',
  CANCELADO: 'bg-red-100 text-red-700',
}

interface ExamesTableProps {
  exames: Exame[]
  carregando: boolean
  onEditar: (e: Exame) => void
  onExcluir: (id: number) => void
}

function formatarData(d: string | undefined) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('pt-BR')
}

function formatarDataHora(d: string | undefined) {
  if (!d) return '-'
  return new Date(d).toLocaleString('pt-BR')
}

export default function ExamesTable({ exames, carregando, onEditar, onExcluir }: ExamesTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médico</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Solicitação</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Realização</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
          ) : exames.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                Nenhum exame cadastrado
              </td>
            </tr>
          ) : (
            exames.map(ex => (
              <tr key={ex.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{ex.tipoExame?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{ex.prontuario?.paciente?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{ex.medico?.usuario?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{formatarDataHora(ex.dataSolicitacao)}</td>
                <td className="px-6 py-4 text-gray-600">{formatarData(ex.dataRealizacao)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CORES[ex.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {ex.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(ex)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExcluir(ex.id)}
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
