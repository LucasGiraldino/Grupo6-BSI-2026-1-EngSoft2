import { Trash2, Loader, Clock } from 'lucide-react'
import { AgendaSlot } from '../hooks/useAgendaData'

interface AgendaSlotsTableProps {
  slots: AgendaSlot[]
  carregando: boolean
  onExcluir: (id: number) => void
}

function formatarHora(hora: string) {
  return hora ? hora.substring(0, 5) : ''
}

function formatarData(d: string | undefined) {
  if (!d) return '-'
  const [ano, mes, dia] = d.substring(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

export default function AgendaSlotsTable({ slots, carregando, onExcluir }: AgendaSlotsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Horários Cadastrados
          {slots.length > 0 && (
            <span className="text-xs font-normal text-gray-400">({slots.length} registro{slots.length !== 1 ? 's' : ''})</span>
          )}
        </h4>
      </div>

      {carregando ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : slots.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          Nenhum horário cadastrado para este profissional
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora Início</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora Fim</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponível</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {slots.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-sm text-gray-900">{formatarData(s.data)}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{formatarHora(s.horaInicio)}</td>
                  <td className="px-5 py-3 text-sm text-gray-600">{formatarHora(s.horaFim)}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      s.disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {s.disponivel ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => onExcluir(s.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover horário"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
