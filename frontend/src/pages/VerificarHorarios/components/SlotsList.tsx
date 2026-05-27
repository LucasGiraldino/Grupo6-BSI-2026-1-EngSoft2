import { Clock, CalendarDays, User as UserIcon } from 'lucide-react'
import type { SlotDetalhado } from '../hooks/useVerificarHorarios'

interface SlotsListProps {
  diaSelecionado: string
  slotExpandido: SlotDetalhado | null
  horariosDoDia: (chave: string) => { id: number; data: string; horaInicio: string; horaFim: string }[]
  onSelecionarSlot: (slot: any) => void
  formatarData: (d: string | undefined) => string
  formatarHora: (hora: string) => string
}

export default function SlotsList({
  diaSelecionado,
  slotExpandido,
  horariosDoDia,
  onSelecionarSlot,
  formatarData,
  formatarHora,
}: SlotsListProps) {
  const slots = horariosDoDia(diaSelecionado)

  return (
    <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Horários Disponíveis — {formatarData(diaSelecionado)}
      </h4>
      {slots.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">Nenhum horário disponível neste dia</p>
      ) : (
        <div className="space-y-2">
          {slots.map(slot => (
            <div key={slot.id}>
              <button
                onClick={() => onSelecionarSlot(slot)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {formatarHora(slot.horaInicio)} — {formatarHora(slot.horaFim)}
                  </span>
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  {slotExpandido?.id === slot.id ? 'Ocultar' : 'Detalhes'}
                </span>
              </button>
              {slotExpandido?.id === slot.id && (
                <div className="mx-4 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{slotExpandido.profissionalNome}</span>
                    <span className="text-gray-400">—</span>
                    <span>{slotExpandido.profissionalEspecialidade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <span>{formatarData(slotExpandido.data)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{formatarHora(slotExpandido.horaInicio)} às {formatarHora(slotExpandido.horaFim)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
