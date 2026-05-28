import { useState, useCallback } from 'react'
import { AgendaDisponivel, Consulta } from './useConsultasData'
import { criarConsulta, atualizarConsulta } from '../../../services/consultaService'

export function useConsultasForm(
  profissionalId: string,
  modalSlot: AgendaDisponivel | null,
  modalTriagem: Consulta | null,
  setModalSlot: (slot: AgendaDisponivel | null) => void,
  setModalTriagem: (c: Consulta | null) => void,
  carregarDadosMes: () => void,
  carregarPacientesTriagem: () => void,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [formPaciente, setFormPaciente] = useState('')
  const [formTipo, setFormTipo] = useState('')
  const [formObs, setFormObs] = useState('')
  const [formStatus, setFormStatus] = useState('AGENDADA')
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  const resetForm = useCallback(() => {
    setFormPaciente('')
    setFormTipo('CONSULTA')
    setFormObs('')
    setFormStatus('AGENDADA')
    setErroForm('')
    setSalvando(false)
  }, [])

  const abrirModalCriar = useCallback((slot: AgendaDisponivel, triagem?: Consulta | null) => {
    if (triagem) {
      setModalSlot(slot)
      setModalTriagem(triagem)
      setEditandoId(null)
      setFormPaciente('')
      setFormTipo(triagem.tipoConsulta)
      setFormObs(triagem.observacoes ?? '')
      setFormStatus('AGENDADA')
      setErroForm('')
      setModalAberto(true)
    } else {
      setModalSlot(slot)
      setModalTriagem(null)
      setEditandoId(null)
      resetForm()
      setModalAberto(true)
    }
  }, [setModalSlot, setModalTriagem, resetForm])

  const abrirModalEditar = useCallback((consulta: Consulta) => {
    setModalSlot(null)
    setModalTriagem(null)
    setEditandoId(consulta.id)
    setFormPaciente(String(consulta.paciente.id))
    setFormTipo(consulta.tipoConsulta)
    setFormObs(consulta.observacoes ?? '')
    setFormStatus(consulta.status)
    setErroForm('')
    setModalAberto(true)
  }, [setModalTriagem])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    setErroForm('')

    try {
      if (modalTriagem) {
        const body = {
          profissional: { id: parseInt(profissionalId) },
          agenda: { id: modalSlot!.id },
          status: 'AGENDADA',
        }
        await atualizarConsulta(modalTriagem.id, body)
      } else if (editandoId) {
        const body = {
          paciente: { id: parseInt(formPaciente) },
          tipoConsulta: formTipo,
          observacoes: formObs || null,
          status: formStatus,
        }
        await atualizarConsulta(editandoId, body)
      } else {
        const body = {
          paciente: { id: parseInt(formPaciente) },
          profissional: { id: parseInt(profissionalId) },
          agenda: { id: modalSlot!.id },
          tipoConsulta: formTipo,
          observacoes: formObs || null,
          status: 'AGENDADA',
          dataAgendamento: new Date().toISOString(),
        }
        await criarConsulta(body)
      }

      setModalAberto(false)
      setModalTriagem(null)
      mostrarToast(
        modalTriagem ? 'Consulta agendada com sucesso!' :
        editandoId ? 'Consulta atualizada com sucesso!' :
        'Consulta criada com sucesso!',
        'sucesso',
      )
      carregarDadosMes()
      carregarPacientesTriagem()
    } catch {
      setErroForm('Erro ao salvar. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }, [profissionalId, modalSlot, modalTriagem, editandoId, formPaciente, formTipo, formObs, formStatus, setModalTriagem, carregarDadosMes, carregarPacientesTriagem, mostrarToast])

  const fecharModal = useCallback(() => {
    setModalAberto(false)
  }, [])

  return {
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
    setEditandoId,
  }
}
