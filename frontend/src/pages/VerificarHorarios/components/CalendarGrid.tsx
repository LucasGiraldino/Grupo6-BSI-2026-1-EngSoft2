import { Loader } from 'lucide-react'

interface CalendarGridProps {
  semanas: (number | null)[][]
  ano: number
  mes: number
  carregandoMes: boolean
  diaSelecionado: string | null
  diasSemana: string[]
  onDiaClick: (chave: string | null) => void
  formatDateKey: (ano: number, mes: number, dia: number) => string
  diaTemSlot: (ano: number, mes: number, dia: number) => boolean
}

export default function CalendarGrid({
  semanas,
  ano,
  mes,
  carregandoMes,
  diaSelecionado,
  diasSemana,
  onDiaClick,
  formatDateKey,
  diaTemSlot,
}: CalendarGridProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="grid grid-cols-7">
        {diasSemana.map(d => (
          <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
            {d}
          </div>
        ))}
        {carregandoMes ? (
          <div className="col-span-7 py-20 text-center text-gray-400">
            <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
            Carregando horários...
          </div>
        ) : (
          semanas.flat().map((dia, i) => {
            if (dia === null) {
              return <div key={`e-${i}`} className="px-2 py-4 border-b border-r border-gray-100 bg-gray-50/50" />
            }
            const chave = formatDateKey(ano, mes, dia)
            const temSlot = diaTemSlot(ano, mes, dia)
            const passado = new Date(ano, mes, dia) < new Date(new Date().setHours(0, 0, 0, 0))
            const selecionado = diaSelecionado === chave

            return (
              <button
                key={chave}
                disabled={passado || !temSlot}
                onClick={() => onDiaClick(selecionado ? null : chave)}
                className={`px-2 py-4 border-b border-r border-gray-100 transition-colors relative
                  ${passado || !temSlot ? 'cursor-default' : 'hover:bg-gray-50 cursor-pointer'}
                  ${selecionado ? 'ring-2 ring-inset ring-[#030213] bg-blue-50' : ''}`}
              >
                <span className={`text-sm font-medium ${passado ? 'text-gray-300' : selecionado ? 'text-[#030213]' : 'text-gray-700'}`}>
                  {dia}
                </span>
                {temSlot && (
                  <div className="flex items-center justify-center mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" title="Horários disponíveis" />
                  </div>
                )}
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
