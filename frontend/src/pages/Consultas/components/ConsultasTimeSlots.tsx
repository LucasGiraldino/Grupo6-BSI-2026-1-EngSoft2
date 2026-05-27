import { Clock } from 'lucide-react'
import { AgendaDisponivel, Consulta } from '../hooks/useConsultasData'

const STATUS_CORES: Record<string, string> = {
  AGENDADA: 'bg-blue-100 text-blue-700',
  CONCLUIDA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-red-100 text-red-700',
  ESPERANDO: 'bg-orange-100 text-orange-700',
}

interface ConsultasTimeSlotsProps {
  diaSelecionado: string
  pacienteTriagemSelecionado: Consulta | null
  items: { tipo: 'slot' | 'consulta'; slot?: AgendaDisponivel; consulta?: Consulta; ordenador: string }[]
  formatarData: (d: string | undefined) => string
  formatarHora: (hora: string) => string
  abrirModalCriar: (slot: AgendaDisponivel) => void
  abrirModalEditar: (consulta: Consulta) => void
}

export default function ConsultasTimeSlots({
  diaSelecionado,
  pacienteTriagemSelecionado,
  items,
  formatarData,
  formatarHora,
  abrirModalCriar,
  abrirModalEditar,
}: ConsultasTimeSlotsProps) {
  return (
    <div key={diaSelecionado} className="anim-slide mt-4 bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Horários — {formatarData(diaSelecionado)}
      </h4>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">Nenhum horário disponível neste dia</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {items.map((item, idx) => (
            item.tipo === 'slot' ? (
              <button
                key={`s-${item.slot!.id}-${idx}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
                onClick={() => abrirModalCriar(item.slot!)}
                className="anim-item w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatarHora(item.slot!.horaInicio)} — {formatarHora(item.slot!.horaFim)}
                  </span>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {pacienteTriagemSelecionado ? 'Agendar paciente' : 'Agendar'}
                </span>
              </button>
            ) : (
              <button
                key={`c-${item.consulta!.id}-${idx}`}
                style={{ animationDelay: `${idx * 0.04}s` }}
                onClick={() => abrirModalEditar(item.consulta!)}
                className="anim-item w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-gray-700">
                      {formatarHora(item.consulta!.agenda!.horaInicio)} — {formatarHora(item.consulta!.agenda!.horaFim)}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">{item.consulta!.paciente.nome}</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${STATUS_CORES[item.consulta!.status] || 'bg-gray-100 text-gray-700'}`}>
                  {item.consulta!.status}
                </span>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  )
}
