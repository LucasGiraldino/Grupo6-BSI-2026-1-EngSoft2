import { useState, useEffect, useCallback } from 'react'
import { listarProfissionais, listarConsultas, listarAgendaMes, listarConsultasAgenda, cancelarConsulta } from '../../../services/consultaService'
import { listarPacientes } from '../../../services/pacienteService'
import type { Paciente, Profissional, AgendaDisponivel, TriagemResumo, Consulta } from '../../../types'
export type { Paciente, Profissional, AgendaDisponivel, TriagemResumo, Consulta }

export function useConsultasData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [mesAtual, setMesAtual] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [slotsMes, setSlotsMes] = useState<AgendaDisponivel[]>([])
  const [consultasMes, setConsultasMes] = useState<Consulta[]>([])
  const [pacientesTriagem, setPacientesTriagem] = useState<Consulta[]>([])
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)
  const [pacienteTriagemSelecionado, setPacienteTriagemSelecionado] = useState<Consulta | null>(null)
  const [carregandoMes, setCarregandoMes] = useState(false)
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)
  const [modalDetalhesTriagem, setModalDetalhesTriagem] = useState<TriagemResumo | null>(null)

  useEffect(() => {
    Promise.all([
      listarProfissionais().then(setProfissionais),
      listarPacientes().then(setPacientes),
    ])
    carregarPacientesTriagem()
  }, [])

  useEffect(() => {
    if (profissionalId) {
      carregarDadosMes()
    }
  }, [profissionalId, mesAtual])

  async function carregarPacientesTriagem() {
    try {
      const data = await listarConsultas({ status: 'ESPERANDO' })
      setPacientesTriagem(data)
    } catch {}
  }

  function carregarDadosMes() {
    if (!profissionalId) return
    setCarregandoMes(true)
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth() + 1
    const primeiroDia = `${ano}-${String(mes).padStart(2, '0')}-01`
    const ultimoDiaNum = new Date(ano, mes, 0).getDate()
    const ultimoDia = `${ano}-${String(mes).padStart(2, '0')}-${String(ultimoDiaNum).padStart(2, '0')}`

    Promise.all([
      listarAgendaMes(profissionalId, ano, mes),
      listarConsultasAgenda({ profissional: profissionalId, dataInicio: primeiroDia, dataFim: ultimoDia }),
    ])
      .then(([slots, consultas]) => {
        setSlotsMes(slots)
        setConsultasMes(consultas)
      })
      .catch(() => {
        setSlotsMes([])
        setConsultasMes([])
      })
      .finally(() => setCarregandoMes(false))
  }

  const formatarData = useCallback((d: string | undefined) => {
    if (!d) return '-'
    const [ano, mes, dia] = d.substring(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
  }, [])

  const formatarHora = useCallback((hora: string) => {
    return hora ? hora.substring(0, 5) : ''
  }, [])

  const formatarDataHora = useCallback((d: string | undefined) => {
    if (!d) return '-'
    return new Date(d).toLocaleString('pt-BR')
  }, [])

  function formatDateKey(ano: number, mes: number, dia: number): string {
    return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
  }

  function getDiasMes(): (number | null)[][] {
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth()
    const primeiroDia = new Date(ano, mes, 1).getDay()
    const totalDias = new Date(ano, mes + 1, 0).getDate()
    const semanas: (number | null)[][] = []
    let linha: (number | null)[] = []
    for (let i = 0; i < primeiroDia; i++) linha.push(null)
    for (let d = 1; d <= totalDias; d++) {
      linha.push(d)
      if (linha.length === 7) { semanas.push(linha); linha = [] }
    }
    if (linha.length > 0) {
      while (linha.length < 7) linha.push(null)
      semanas.push(linha)
    }
    return semanas
  }

  const diaTemSlot = useCallback((ano: number, mes: number, dia: number): boolean => {
    const chave = formatDateKey(ano, mes, dia)
    return slotsMes.some(s => s.data === chave)
  }, [slotsMes])

  const diaTemConsulta = useCallback((ano: number, mes: number, dia: number): boolean => {
    const chave = formatDateKey(ano, mes, dia)
    return consultasMes.some(c => c.agenda?.data === chave)
  }, [consultasMes])

  const diaEhPassado = useCallback((ano: number, mes: number, dia: number): boolean => {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return new Date(ano, mes, dia) < hoje
  }, [])

  const horariosDoDia = useCallback((chave: string) => {
    const slots = slotsMes.filter(s => s.data === chave)
    let consultas = consultasMes.filter(c => c.agenda?.data === chave)
    if (filtroStatus) {
      consultas = consultas.filter(c => c.status === filtroStatus)
    }
    const items: { tipo: 'slot' | 'consulta'; slot?: AgendaDisponivel; consulta?: Consulta; ordenador: string }[] = []
    slots.forEach(s => items.push({ tipo: 'slot', slot: s, ordenador: s.horaInicio }))
    consultas.forEach(c => items.push({ tipo: 'consulta', consulta: c, ordenador: c.agenda!.horaInicio }))
    items.sort((a, b) => a.ordenador.localeCompare(b.ordenador))
    return items
  }, [slotsMes, consultasMes, filtroStatus])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await cancelarConsulta(idParaExcluir)
      mostrarToast('Consulta cancelada com sucesso!', 'sucesso')
    } catch {}
    setIdParaExcluir(null)
    carregarDadosMes()
    carregarPacientesTriagem()
  }, [idParaExcluir, mostrarToast])

  const prevMonth = useCallback(() => {
    setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }, [])

  const nextMonth = useCallback(() => {
    setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }, [])

  const selectDia = useCallback((chave: string | null) => {
    setDiaSelecionado(prev => prev === chave ? null : chave)
  }, [])

  return {
    profissionais,
    profissionalId,
    setProfissionalId,
    filtroStatus,
    setFiltroStatus,
    pacientes,
    mesAtual,
    slotsMes,
    consultasMes,
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
    formatarDataHora,
    formatDateKey,
    getDiasMes,
    diaTemSlot,
    diaTemConsulta,
    diaEhPassado,
    horariosDoDia,
    confirmarDelete,
    prevMonth,
    nextMonth,
    selectDia,
    setMesAtual,
  }
}
