import { useState, useCallback, useEffect } from 'react'
import { listarProfissionaisAgenda, listarSlots, excluirSlot } from '../../../services/agendaService'
import type { AgendaSlot, Profissional } from '../../../types'
export type { AgendaSlot }

type ProfissionalAgenda = Pick<Profissional, 'id' | 'especialidade' | 'usuario'>

export function useAgendaData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [profissionais, setProfissionais] = useState<ProfissionalAgenda[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [slots, setSlots] = useState<AgendaSlot[]>([])
  const [carregando, setCarregando] = useState(false)
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregarProfissionais = useCallback(async () => {
    try {
      const data = await listarProfissionaisAgenda()
      setProfissionais(data)
    } catch {}
  }, [])

  useEffect(() => { carregarProfissionais() }, [carregarProfissionais])

  const carregarSlots = useCallback(async () => {
    if (!profissionalId) { setSlots([]); return }
    setCarregando(true)
    try {
      const data = await listarSlots(profissionalId)
      setSlots(data)
    } catch {
      setSlots([])
    }
    setCarregando(false)
  }, [profissionalId])

  useEffect(() => {
    carregarSlots()
  }, [carregarSlots])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirSlot(idParaExcluir)
      mostrarToast('Horário removido com sucesso!', 'sucesso')
      carregarSlots()
    } catch {
      mostrarToast('Erro ao remover horário', 'erro')
    }
    setIdParaExcluir(null)
  }, [idParaExcluir, carregarSlots, mostrarToast])

  return {
    profissionais,
    profissionalId,
    setProfissionalId,
    slots,
    carregando,
    idParaExcluir,
    setIdParaExcluir,
    carregarSlots,
    confirmarDelete,
  }
}
