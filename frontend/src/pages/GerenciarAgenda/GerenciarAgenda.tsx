import { useCallback } from 'react'
import { Clock } from 'lucide-react'
import { toast } from '../../services/toastService'
import { useAgendaData } from './hooks/useAgendaData'
import { useAgendaForm } from './hooks/useAgendaForm'
import AgendaProfissionalSelect from './components/AgendaProfissionalSelect'
import AgendaAddForm from './components/AgendaAddForm'
import AgendaSlotsTable from './components/AgendaSlotsTable'
import AgendaDeleteModal from './components/AgendaDeleteModal'

export default function GerenciarAgendaPage() {
  const {
    profissionais,
    profissionalId,
    setProfissionalId,
    slots,
    carregando,
    idParaExcluir,
    setIdParaExcluir,
    carregarSlots,
    confirmarDelete,
  } = useAgendaData(toast.mostrar)

  const {
    formData,
    setFormData,
    formHoraInicio,
    setFormHoraInicio,
    formHoraFim,
    setFormHoraFim,
    salvando,
    erroForm,
    adicionarSlot,
    limparForm,
  } = useAgendaForm(profissionalId, profissionais, carregarSlots, toast.mostrar)

  const handleProfissionalChange = useCallback((value: string) => {
    setProfissionalId(value)
    limparForm()
  }, [setProfissionalId, limparForm])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Gerenciar Agenda</h3>
      </div>

      <AgendaProfissionalSelect
        profissionalId={profissionalId}
        profissionais={profissionais}
        onChange={handleProfissionalChange}
      />

      {profissionalId ? (
        <>
          <AgendaAddForm
            formData={formData}
            formHoraInicio={formHoraInicio}
            formHoraFim={formHoraFim}
            salvando={salvando}
            erroForm={erroForm}
            onDataChange={setFormData}
            onHoraInicioChange={setFormHoraInicio}
            onHoraFimChange={setFormHoraFim}
            onAdicionar={adicionarSlot}
          />

          <AgendaSlotsTable
            slots={slots}
            carregando={carregando}
            onExcluir={setIdParaExcluir}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 py-20">
          <div className="text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Selecione um profissional para gerenciar os horários</p>
          </div>
        </div>
      )}

      <AgendaDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

    </>
  )
}
