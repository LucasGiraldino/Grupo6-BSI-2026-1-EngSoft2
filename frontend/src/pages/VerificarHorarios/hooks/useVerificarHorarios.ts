import { useState, useEffect, useCallback } from 'react'
import api from '../../../services/api'
import type { AgendaDisponivel, Profissional } from '../../../types'

type ProfissionalVerificar = Pick<Profissional, 'id' | 'especialidade' | 'usuario'>

export interface SlotDetalhado extends AgendaDisponivel {
  profissionalNome: string
  profissionalEspecialidade: string
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

export function useVerificarHorarios(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [profissionais, setProfissionais] = useState<ProfissionalVerificar[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [mesAtual, setMesAtual] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [slotsMes, setSlotsMes] = useState<AgendaDisponivel[]>([])
  const [carregandoProfissionais, setCarregandoProfissionais] = useState(true)
  const [carregandoMes, setCarregandoMes] = useState(false)
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)
  const [slotExpandido, setSlotExpandido] = useState<SlotDetalhado | null>(null)

  const alterarMes = useCallback((delta: number) => {
    setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1))
  }, [])

  const carregarProfissionais = useCallback(async () => {
    setCarregandoProfissionais(true)
    try {
      const res = await api.get('/api/profissionais')
      setProfissionais(res.data)
    } catch {
      mostrarToast('Erro ao carregar profissionais', 'erro')
    } finally {
      setCarregandoProfissionais(false)
    }
  }, [mostrarToast])

  useEffect(() => { carregarProfissionais() }, [carregarProfissionais])

  const carregarDadosMes = useCallback(async () => {
    if (!profissionalId) {
      setSlotsMes([])
      return
    }
    setCarregandoMes(true)
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth() + 1
    try {
      const r = await api.get('/api/agenda/disponivel/mes', { params: { idProfissional: profissionalId, ano, mes } })
      setSlotsMes(r.data)
    } catch {
      setSlotsMes([])
      mostrarToast('Erro ao carregar horários disponíveis', 'erro')
    } finally {
      setCarregandoMes(false)
    }
  }, [profissionalId, mesAtual, mostrarToast])

  useEffect(() => {
    if (profissionalId) {
      carregarDadosMes()
      setDiaSelecionado(null)
      setSlotExpandido(null)
    } else {
      setSlotsMes([])
      setDiaSelecionado(null)
      setSlotExpandido(null)
    }
  }, [profissionalId, mesAtual, carregarDadosMes])

  const handleProfissionalChange = useCallback((value: string) => {
    setProfissionalId(value)
    setDiaSelecionado(null)
    setSlotExpandido(null)
  }, [])

  const formatarData = useCallback((d: string | undefined) => {
    if (!d) return '-'
    const [ano, mes, dia] = d.substring(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
  }, [])

  const formatarHora = useCallback((hora: string) => {
    return hora ? hora.substring(0, 5) : ''
  }, [])

  const formatDateKey = useCallback((ano: number, mes: number, dia: number): string => {
    return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
  }, [])

  const getDiasMes = useCallback((): (number | null)[][] => {
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth()
    const primeiroDia = new Date(ano, mes, 1).getDay()
    const totalDias = new Date(ano, mes + 1, 0).getDate()

    const semanas: (number | null)[][] = []
    let linha: (number | null)[] = []
    for (let i = 0; i < primeiroDia; i++) linha.push(null)
    for (let d = 1; d <= totalDias; d++) {
      linha.push(d)
      if (linha.length === 7) {
        semanas.push(linha)
        linha = []
      }
    }
    if (linha.length > 0) {
      while (linha.length < 7) linha.push(null)
      semanas.push(linha)
    }
    return semanas
  }, [mesAtual])

  const diaTemSlot = useCallback((ano: number, mes: number, dia: number): boolean => {
    const chave = formatDateKey(ano, mes, dia)
    return slotsMes.some(s => s.data === chave)
  }, [slotsMes, formatDateKey])

  const horariosDoDia = useCallback((chave: string) => {
    return slotsMes.filter(s => s.data === chave)
  }, [slotsMes])

  const selecionarSlot = useCallback((slot: AgendaDisponivel) => {
    const prof = profissionais.find(p => String(p.id) === profissionalId)
    const detalhado: SlotDetalhado = {
      ...slot,
      profissionalNome: prof?.usuario?.nome ?? '-',
      profissionalEspecialidade: prof?.especialidade ?? '-',
    }
    setSlotExpandido(prev => prev?.id === slot.id ? null : detalhado)
  }, [profissionais, profissionalId])

  const ano = mesAtual.getFullYear()
  const mes = mesAtual.getMonth()
  const semanas = getDiasMes()

  return {
    profissionais,
    profissionalId,
    setProfissionalId: handleProfissionalChange,
    mesAtual,
    alterarMes,
    slotsMes,
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
  }
}
