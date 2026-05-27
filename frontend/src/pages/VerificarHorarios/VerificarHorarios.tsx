import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import Toast from '../../components/Toast'
import { useVerificarHorarios } from './hooks/useVerificarHorarios'
import ProfissionalSelect from './components/ProfissionalSelect'
import CalendarGrid from './components/CalendarGrid'
import SlotsList from './components/SlotsList'

export default function VerificarHorariosPage() {
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const {
    profissionais,
    profissionalId,
    setProfissionalId,
    alterarMes,
    carregandoProfissionais,
    carregandoMes,
    diaSelecionado,
    setDiaSelecionado,
    slotExpandido,
    selecionarSlot,
    semanas,
    ano,
    mes,
    formatDateKey,
    diaTemSlot,
    horariosDoDia,
    formatarData,
    formatarHora,
    DIAS_SEMANA,
    MESES,
  } = useVerificarHorarios(mostrarToast)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Verificar Horários Disponíveis</h3>
      </div>

      <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
        <ProfissionalSelect
          profissionais={profissionais}
          profissionalId={profissionalId}
          carregando={carregandoProfissionais}
          onChange={setProfissionalId}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() => alterarMes(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-base font-semibold text-gray-900 min-w-[160px] text-center">
            {MESES[mes]} {ano}
          </span>
          <button
            onClick={() => alterarMes(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {!profissionalId ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Selecione um profissional para ver os horários disponíveis</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <CalendarGrid
              semanas={semanas}
              ano={ano}
              mes={mes}
              carregandoMes={carregandoMes}
              diaSelecionado={diaSelecionado}
              diasSemana={DIAS_SEMANA}
              onDiaClick={setDiaSelecionado}
              formatDateKey={formatDateKey}
              diaTemSlot={diaTemSlot}
            />

            {diaSelecionado && (
              <SlotsList
                diaSelecionado={diaSelecionado}
                slotExpandido={slotExpandido}
                horariosDoDia={horariosDoDia}
                onSelecionarSlot={selecionarSlot}
                formatarData={formatarData}
                formatarHora={formatarHora}
              />
            )}
          </div>
        </div>
      )}

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </div>
  )
}
