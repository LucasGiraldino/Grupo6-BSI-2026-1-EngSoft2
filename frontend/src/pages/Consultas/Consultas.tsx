import { useState, useEffect, useCallback } from 'react'
import { CalendarDays } from 'lucide-react'
import Toast from '../../components/Toast'
import { useConsultasData } from './hooks/useConsultasData'
import { useConsultasForm } from './hooks/useConsultasForm'
import { AgendaDisponivel } from './hooks/useConsultasData'
import ConsultasProfissionalBar from './components/ConsultasProfissionalBar'
import ConsultasCalendarGrid from './components/ConsultasCalendarGrid'
import ConsultasTimeSlots from './components/ConsultasTimeSlots'
import ConsultasTriagemPanel from './components/ConsultasTriagemPanel'
import ConsultasFormModal from './components/ConsultasFormModal'
import ConsultasTriagemDetailsModal from './components/ConsultasTriagemDetailsModal'
import ConsultasDeleteModal from './components/ConsultasDeleteModal'

export default function ConsultasPage() {
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
    filtroStatus,
    setFiltroStatus,
    pacientes,
    pacientesTriagem,
    diaSelecionado,
    pacienteTriagemSelecionado,
    setPacienteTriagemSelecionado,
    carregandoMes,
    idParaExcluir,
    setIdParaExcluir,
    modalDetalhesTriagem,
    setModalDetalhesTriagem,
    carregarPacientesTriagem,
    carregarDadosMes,
    formatarData,
    formatarHora,
    formatDateKey,
    getDiasMes,
    diaTemSlot,
    diaTemConsulta,
    diaEhPassado,
    horariosDoDia,
    confirmarDelete,
    prevMonth,
    nextMonth,
    mesAtual,
    selectDia,
  } = useConsultasData(mostrarToast)

  const [modalSlot, setModalSlot] = useState<AgendaDisponivel | null>(null)
  const [modalTriagem, setModalTriagem] = useState<import('./hooks/useConsultasData').Consulta | null>(null)

  const {
    modalAberto,
    editandoId,
    formPaciente,
    setFormPaciente,
    formTipo,
    setFormTipo,
    formObs,
    setFormObs,
    formStatus,
    setFormStatus,
    erroForm,
    salvando,
    abrirModalCriar,
    abrirModalEditar,
    salvar,
    fecharModal,
    setModalAberto,
  } = useConsultasForm(profissionalId, modalSlot, modalTriagem, setModalSlot, setModalTriagem, carregarDadosMes, carregarPacientesTriagem, mostrarToast)

  const handleProfissionalChange = useCallback((id: string) => {
    setProfissionalId(id)
    selectDia(null)
    setPacienteTriagemSelecionado(null)
  }, [setProfissionalId, selectDia, setPacienteTriagemSelecionado])

  // Animation styles
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
      @keyframes fadeSlideUp { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      .anim-slide { animation: fadeSlideIn 0.25s ease-out both; }
      .anim-item  { animation: fadeSlideUp 0.2s ease-out both; }
    `
    document.head.appendChild(style)
    return () => style.remove()
  }, [])

  const semanas = getDiasMes()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Agenda de Consultas</h3>
      </div>

      <ConsultasProfissionalBar
        profissionais={profissionais}
        profissionalId={profissionalId}
        filtroStatus={filtroStatus}
        mesAtual={mesAtual}
        onProfissionalChange={handleProfissionalChange}
        onFiltroStatusChange={setFiltroStatus}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />

      {!profissionalId ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Selecione um profissional para ver a agenda</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
            <ConsultasCalendarGrid
              semanas={semanas}
              mesAtual={mesAtual}
              carregandoMes={carregandoMes}
              diaSelecionado={diaSelecionado}
              formatDateKey={formatDateKey}
              diaTemSlot={diaTemSlot}
              diaTemConsulta={diaTemConsulta}
              diaEhPassado={diaEhPassado}
              selectDia={selectDia}
            />

            {diaSelecionado && (
              <ConsultasTimeSlots
                diaSelecionado={diaSelecionado}
                pacienteTriagemSelecionado={pacienteTriagemSelecionado}
                items={horariosDoDia(diaSelecionado)}
                formatarData={formatarData}
                formatarHora={formatarHora}
                abrirModalCriar={(slot) => abrirModalCriar(slot, pacienteTriagemSelecionado)}
                abrirModalEditar={abrirModalEditar}
              />
            )}
          </div>

          <div className="w-80 flex-shrink-0">
            <ConsultasTriagemPanel
              pacientesTriagem={pacientesTriagem}
              pacienteTriagemSelecionado={pacienteTriagemSelecionado}
              onSelectPaciente={setPacienteTriagemSelecionado}
              onVerTriagem={setModalDetalhesTriagem}
            />
          </div>
        </div>
      )}

      <ConsultasFormModal
        aberto={modalAberto}
        editandoId={editandoId}
        modalSlot={modalSlot}
        modalTriagem={modalTriagem}
        formPaciente={formPaciente}
        formTipo={formTipo}
        formObs={formObs}
        formStatus={formStatus}
        erroForm={erroForm}
        salvando={salvando}
        pacientes={pacientes}
        onFormPacienteChange={setFormPaciente}
        onFormTipoChange={setFormTipo}
        onFormObsChange={setFormObs}
        onFormStatusChange={setFormStatus}
        onSalvar={salvar}
        onFechar={fecharModal}
        onCancelar={() => {
          fecharModal()
          setIdParaExcluir(editandoId)
        }}
      />

      <ConsultasTriagemDetailsModal
        triagem={modalDetalhesTriagem}
        onFechar={() => setModalDetalhesTriagem(null)}
      />

      <ConsultasDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onVoltar={() => {
          setIdParaExcluir(null)
          setModalAberto(true)
        }}
      />

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </div>
  )
}
