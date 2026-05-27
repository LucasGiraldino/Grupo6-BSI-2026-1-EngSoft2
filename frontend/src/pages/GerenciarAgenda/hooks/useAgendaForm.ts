import { useState, useCallback } from 'react'
import { criarSlot } from '../../../services/agendaService'

export function useAgendaForm(
  profissionalId: string,
  profissionais: { id: number; usuario: { id: number; nome: string }; especialidade: string }[],
  carregarSlots: () => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [formData, setFormData] = useState('')
  const [formHoraInicio, setFormHoraInicio] = useState('')
  const [formHoraFim, setFormHoraFim] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  const limparForm = useCallback(() => {
    setFormData('')
    setFormHoraInicio('')
    setFormHoraFim('')
    setErroForm('')
  }, [])

  const adicionarSlot = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData || !formHoraInicio || !formHoraFim) {
      setErroForm('Preencha todos os campos')
      return
    }
    if (formHoraInicio >= formHoraFim) {
      setErroForm('Hora fim deve ser maior que hora início')
      return
    }

    const profissional = profissionais.find(p => String(p.id) === profissionalId)
    if (!profissional) return

    setSalvando(true)
    setErroForm('')
    try {
      await criarSlot({
        usuario: { id: profissional.usuario.id },
        data: formData,
        horaInicio: formHoraInicio,
        horaFim: formHoraFim,
        disponivel: true,
      })
      mostrarToast('Horário adicionado com sucesso!', 'sucesso')
      limparForm()
      carregarSlots()
    } catch {
      setErroForm('Erro ao adicionar horário')
    }
    setSalvando(false)
  }, [formData, formHoraInicio, formHoraFim, profissionalId, profissionais, carregarSlots, mostrarToast, limparForm])

  return {
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
  }
}
