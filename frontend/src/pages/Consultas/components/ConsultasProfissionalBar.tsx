import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Profissional } from '../hooks/useConsultasData'

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

interface ConsultasProfissionalBarProps {
  profissionais: Profissional[]
  profissionalId: string
  filtroStatus: string
  mesAtual: Date
  onProfissionalChange: (id: string) => void
  onFiltroStatusChange: (status: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
}

export default function ConsultasProfissionalBar({
  profissionais,
  profissionalId,
  filtroStatus,
  mesAtual,
  onProfissionalChange,
  onFiltroStatusChange,
  onPrevMonth,
  onNextMonth,
}: ConsultasProfissionalBarProps) {
  return (
    <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Profissional:</label>
        <select
          value={profissionalId}
          onChange={e => {
            onProfissionalChange(e.target.value)
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] min-w-[250px]"
        >
          <option value="">Selecione um profissional</option>
          {profissionais.map(p => (
            <option key={p.id} value={p.id}>{p.usuario?.nome} - {p.especialidade}</option>
          ))}
        </select>
        <label className="text-sm font-medium text-gray-700 ml-2">Status:</label>
        <select
          value={filtroStatus}
          onChange={e => onFiltroStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
        >
          <option value="">Todos</option>
          <option value="AGENDADA">Agendada</option>
          <option value="CONCLUIDA">Concluída</option>
          <option value="CANCELADA">Cancelada</option>
          <option value="ESPERANDO">Esperando</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={onPrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-base font-semibold text-gray-900 min-w-[160px] text-center">
          {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
        </span>
        <button onClick={onNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  )
}
