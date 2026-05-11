import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, User, X, Trash2, Loader, Stethoscope, CalendarDays } from 'lucide-react'

interface Paciente {
  id: number
  nome: string
  cpf: string
}

interface Profissional {
  id: number
  usuario: { nome: string }
  especialidade: string
}

interface AgendaDisponivel {
  id: number
  data: string
  horaInicio: string
  horaFim: string
}

interface TriagemResumo {
  id: number
  pressaoArterial?: string
  febre?: number
  condicaoClinica: string
  condicaoNutricional?: string
  condicaoSocial?: string
  observacoes?: string
  dataTriagem: string
  medico?: { usuario?: { nome: string }; crm?: string }
}

interface Consulta {
  id: number
  paciente: Paciente
  profissional?: Profissional
  agenda?: {
    id: number
    data: string
    horaInicio: string
    horaFim: string
  }
  tipoConsulta: string
  status: string
  observacoes?: string
  dataAgendamento: string
  triagem?: TriagemResumo
}

const STATUS_CORES: Record<string, string> = {
  AGENDADA: 'bg-blue-100 text-blue-700',
  CONCLUIDA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-red-100 text-red-700',
  ESPERANDO: 'bg-orange-100 text-orange-700',
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

export default function Consultas() {
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

  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [mesAtual, setMesAtual] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [slotsMes, setSlotsMes] = useState<AgendaDisponivel[]>([])
  const [consultasMes, setConsultasMes] = useState<Consulta[]>([])
  const [pacientesTriagem, setPacientesTriagem] = useState<Consulta[]>([])
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)
  const [pacienteTriagemSelecionado, setPacienteTriagemSelecionado] = useState<Consulta | null>(null)
  const [carregandoMes, setCarregandoMes] = useState(false)

  const [modalAberto, setModalAberto] = useState(false)
  const [modalSlot, setModalSlot] = useState<AgendaDisponivel | null>(null)
  const [modalTriagem, setModalTriagem] = useState<Consulta | null>(null)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [formPaciente, setFormPaciente] = useState('')
  const [formTipo, setFormTipo] = useState('')
  const [formObs, setFormObs] = useState('')
  const [formStatus, setFormStatus] = useState('AGENDADA')
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)
  const [modalDetalhesTriagem, setModalDetalhesTriagem] = useState<TriagemResumo | null>(null)

  useEffect(() => {
    carregarProfissionais()
    carregarPacientes()
    carregarPacientesTriagem()
  }, [])

  useEffect(() => {
    if (profissionalId) {
      carregarDadosMes()
    }
  }, [profissionalId, mesAtual])

  async function carregarProfissionais() {
    try {
      const res = await fetch('/api/profissionais')
      setProfissionais(await res.json())
    } catch {}
  }

  async function carregarPacientes() {
    try {
      const res = await fetch('/api/pacientes')
      setPacientes(await res.json())
    } catch {}
  }

  async function carregarPacientesTriagem() {
    try {
      const res = await fetch('/api/consultas?status=ESPERANDO')
      setPacientesTriagem(await res.json())
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
      fetch(`/api/agenda/disponivel/mes?idProfissional=${profissionalId}&ano=${ano}&mes=${mes}`).then(r => r.json()),
      fetch(`/api/consultas/agenda?profissional=${profissionalId}&dataInicio=${primeiroDia}&dataFim=${ultimoDia}`).then(r => r.json()),
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

  function formatarData(d: string | undefined) {
    if (!d) return '-'
    const [ano, mes, dia] = d.substring(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
  }

  function formatarHora(hora: string) {
    return hora ? hora.substring(0, 5) : ''
  }

  function formatarDataHora(d: string | undefined) {
    if (!d) return '-'
    return new Date(d).toLocaleString('pt-BR')
  }

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
  }

  function diaTemSlot(ano: number, mes: number, dia: number): boolean {
    const chave = formatDateKey(ano, mes, dia)
    return slotsMes.some(s => s.data === chave)
  }

  function diaTemConsulta(ano: number, mes: number, dia: number): boolean {
    const chave = formatDateKey(ano, mes, dia)
    return consultasMes.some(c => c.agenda?.data === chave)
  }

  function diaEhPassado(ano: number, mes: number, dia: number): boolean {
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    return new Date(ano, mes, dia) < hoje
  }

  function horariosDoDia(chave: string) {
    const slots = slotsMes.filter(s => s.data === chave)
    const consultas = consultasMes.filter(c => c.agenda?.data === chave)
    const items: { tipo: 'slot' | 'consulta'; slot?: AgendaDisponivel; consulta?: Consulta; ordenador: string }[] = []
    slots.forEach(s => items.push({ tipo: 'slot', slot: s, ordenador: s.horaInicio }))
    consultas.forEach(c => items.push({ tipo: 'consulta', consulta: c, ordenador: c.agenda!.horaInicio }))
    items.sort((a, b) => a.ordenador.localeCompare(b.ordenador))
    return items
  }

  function abrirModalCriar(slot: AgendaDisponivel) {
    if (pacienteTriagemSelecionado) {
      setModalSlot(slot)
      setModalTriagem(pacienteTriagemSelecionado)
      setEditandoId(null)
      setFormPaciente('')
      setFormTipo(pacienteTriagemSelecionado.tipoConsulta)
      setFormObs(pacienteTriagemSelecionado.observacoes ?? '')
      setFormStatus('AGENDADA')
      setErroForm('')
      setModalAberto(true)
    } else {
      setModalSlot(slot)
      setModalTriagem(null)
      setEditandoId(null)
      setFormPaciente('')
      setFormTipo('')
      setFormObs('')
      setFormStatus('AGENDADA')
      setErroForm('')
      setModalAberto(true)
    }
  }

  function abrirModalEditar(consulta: Consulta) {
    setModalSlot(null)
    setModalTriagem(null)
    setEditandoId(consulta.id)
    setFormPaciente(String(consulta.paciente.id))
    setFormTipo(consulta.tipoConsulta)
    setFormObs(consulta.observacoes ?? '')
    setFormStatus(consulta.status)
    setErroForm('')
    setModalAberto(true)
  }

  async function salvar(e: React.FormEvent) {
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
        const res = await fetch(`/api/consultas/${modalTriagem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
      } else if (editandoId) {
        const body: Record<string, unknown> = {
          paciente: { id: parseInt(formPaciente) },
          tipoConsulta: formTipo,
          observacoes: formObs || null,
          status: formStatus,
        }
        const res = await fetch(`/api/consultas/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
      } else {
        const body: Record<string, unknown> = {
          paciente: { id: parseInt(formPaciente) },
          profissional: { id: parseInt(profissionalId) },
          agenda: { id: modalSlot!.id },
          tipoConsulta: formTipo,
          observacoes: formObs || null,
          status: 'AGENDADA',
          dataAgendamento: new Date().toISOString(),
        }
        const res = await fetch('/api/consultas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error()
      }

      setModalAberto(false)
      setPacienteTriagemSelecionado(null)
      carregarDadosMes()
      carregarPacientesTriagem()
    } catch {
      setErroForm('Erro ao salvar. Verifique os dados e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await fetch(`/api/consultas/${idParaExcluir}`, { method: 'DELETE' })
    } catch {}
    setIdParaExcluir(null)
    setModalAberto(false)
    carregarDadosMes()
    carregarPacientesTriagem()
  }

  const ano = mesAtual.getFullYear()
  const mes = mesAtual.getMonth()
  const semanas = getDiasMes()

  return (
    <div className="flex flex-col h-full">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Agenda de Consultas</h3>
      </div>

      {/* PROFESSIONAL SELECT + MONTH NAV */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Profissional:</label>
          <select
            value={profissionalId}
            onChange={e => {
              setProfissionalId(e.target.value)
              setDiaSelecionado(null)
              setPacienteTriagemSelecionado(null)
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] min-w-[250px]"
          >
            <option value="">Selecione um profissional</option>
            {profissionais.map(p => (
              <option key={p.id} value={p.id}>{p.usuario?.nome} - {p.especialidade}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-base font-semibold text-gray-900 min-w-[160px] text-center">
            {MESES[mes]} {ano}
          </span>
          <button
            onClick={() => setMesAtual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
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
            <p className="text-lg">Selecione um profissional para ver a agenda</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          {/* LEFT PANEL: CALENDAR + TIME SLOTS */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* CALENDAR GRID */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-7">
                {DIAS_SEMANA.map(d => (
                  <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50">
                    {d}
                  </div>
                ))}
                {carregandoMes ? (
                  <div className="col-span-7 py-20 text-center text-gray-400">
                    <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                    Carregando agenda...
                  </div>
                ) : (
                  semanas.flat().map((dia, i) => {
                    if (dia === null) {
                      return <div key={`e-${i}`} className="px-2 py-4 border-b border-r border-gray-100 bg-gray-50/50" />
                    }
                    const chave = formatDateKey(ano, mes, dia)
                    const temSlot = diaTemSlot(ano, mes, dia)
                    const temConsulta = diaTemConsulta(ano, mes, dia)
                    const passado = diaEhPassado(ano, mes, dia)
                    const selecionado = diaSelecionado === chave

                    return (
                      <button
                        key={chave}
                        disabled={passado}
                        onClick={() => setDiaSelecionado(selecionado ? null : chave)}
                        className={`px-2 py-4 border-b border-r border-gray-100 transition-colors relative
                          ${passado ? 'bg-gray-50/50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                          ${selecionado ? 'ring-2 ring-inset ring-[#030213] bg-blue-50' : ''}`}
                      >
                        <span className={`text-sm font-medium ${passado ? 'text-gray-300' : selecionado ? 'text-[#030213]' : 'text-gray-700'}`}>
                          {dia}
                        </span>
                        <div className="flex items-center justify-center gap-1 mt-1.5">
                          {temSlot && <span className="w-2 h-2 rounded-full bg-green-500" title="Horários disponíveis" />}
                          {temConsulta && <span className="w-2 h-2 rounded-full bg-blue-500" title="Consultas agendadas" />}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* TIME SLOTS FOR SELECTED DAY */}
            {diaSelecionado && (
              <div key={diaSelecionado} className="anim-slide mt-4 bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horários — {formatarData(diaSelecionado)}
                </h4>
                {(() => {
                  const items = horariosDoDia(diaSelecionado)
                  if (items.length === 0) {
                    return <p className="text-sm text-gray-400 py-4 text-center">Nenhum horário disponível neste dia</p>
                  }
                  return (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {items.map((item, idx) => (
                        item.tipo === 'slot' ? (
                          <button
                            key={`s-${item.slot!.id}-${idx}`}
                            style={{ animationDelay: `${idx * 0.04}s` }}
                            onClick={() => abrirModalCriar(item.slot!)}
                            className="anim-item w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {formatarHora(item.slot!.horaInicio)} — {formatarHora(item.slot!.horaFim)}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              {pacienteTriagemSelecionado ? 'Agendar paciente' : 'Agendar'}
                            </span>
                          </button>
                        ) : (
                          <button
                            key={`c-${item.consulta!.id}-${idx}`}
                            style={{ animationDelay: `${idx * 0.04}s` }}
                            onClick={() => abrirModalEditar(item.consulta!)}
                            className="anim-item w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="text-sm font-medium text-gray-700">
                                  {formatarHora(item.consulta!.agenda!.horaInicio)} — {formatarHora(item.consulta!.agenda!.horaFim)}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">{item.consulta!.paciente.nome}</span>
                              </div>
                            </div>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${STATUS_CORES[item.consulta!.status] || 'bg-gray-100 text-gray-700'}`}>
                              {item.consulta!.status}
                            </span>
                          </button>
                        )
                      ))}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: TRIAGEM PATIENTS */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Pacientes da Triagem
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">Aguardando agendamento</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {pacientesTriagem.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">Nenhum paciente aguardando</p>
                ) : (
                  pacientesTriagem.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setPacienteTriagemSelecionado(
                        pacienteTriagemSelecionado?.id === c.id ? null : c
                      )}
                      className={`w-full text-left p-3 rounded-lg border transition-colors
                        ${pacienteTriagemSelecionado?.id === c.id
                          ? 'border-[#030213] bg-gray-50 ring-1 ring-[#030213]'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">{c.paciente?.nome}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        Triagem: {formatarDataHora(c.triagem?.dataTriagem)}
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        {c.tipoConsulta}
                      </div>
                      {c.triagem && (
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            setModalDetalhesTriagem(c.triagem!)
                          }}
                          className="mt-1 ml-6 text-xs text-[#030213] hover:underline flex items-center gap-1"
                        >
                          <Stethoscope className="w-3 h-3" />
                          Ver triagem
                        </button>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editandoId ? 'Editar Consulta' : modalTriagem ? 'Agendar da Triagem' : 'Nova Consulta'}
              </h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="p-5 space-y-4">
              {modalTriagem ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                    {modalTriagem.paciente.nome}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <select
                    required
                    value={formPaciente}
                    onChange={e => setFormPaciente(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  >
                    <option value="">Selecione o paciente</option>
                    {pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Consulta</label>
                <input
                  type="text"
                  required
                  value={formTipo}
                  onChange={e => setFormTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  placeholder="Ex: Psicologia, Fisioterapia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={formObs}
                  onChange={e => setFormObs(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
                  placeholder="Observações sobre a consulta..."
                />
              </div>

              {editandoId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  >
                    <option value="AGENDADA">Agendada</option>
                    <option value="CONCLUIDA">Concluída</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>
              )}

              {modalSlot && (
                <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatarData(modalSlot.data)} — {formatarHora(modalSlot.horaInicio)} às {formatarHora(modalSlot.horaFim)}
                </div>
              )}

              {erroForm && (
                <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
              )}

              <div className="flex gap-3 pt-2">
                {editandoId && (
                  <button
                    type="button"
                    onClick={() => { setModalAberto(false); setIdParaExcluir(editandoId) }}
                    className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancelar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={salvando || !formTipo || (!modalTriagem && !formPaciente)}
                  className="flex-1 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {salvando && <Loader className="w-4 h-4 animate-spin" />}
                  {modalTriagem ? 'Confirmar Agendamento' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHES DA TRIAGEM */}
      {modalDetalhesTriagem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#030213]" />
                <h3 className="text-lg font-semibold text-gray-900">Dados da Triagem</h3>
              </div>
              <button onClick={() => setModalDetalhesTriagem(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Data da Triagem</span>
                  <p className="text-sm text-gray-900 mt-0.5">{formatarDataHora(modalDetalhesTriagem.dataTriagem)}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Médico Responsável</span>
                  <p className="text-sm text-gray-900 mt-0.5">{modalDetalhesTriagem.medico?.usuario?.nome ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pressão Arterial</span>
                  <p className="text-sm text-gray-900 mt-0.5">{modalDetalhesTriagem.pressaoArterial ?? '-'}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Febre</span>
                  <p className="text-sm text-gray-900 mt-0.5">{modalDetalhesTriagem.febre != null ? `${modalDetalhesTriagem.febre}°C` : '-'}</p>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Condição Clínica</span>
                <p className="text-sm text-gray-900 mt-0.5">{modalDetalhesTriagem.condicaoClinica}</p>
              </div>
              {modalDetalhesTriagem.condicaoNutricional && (
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Condição Nutricional</span>
                  <p className="text-sm text-gray-900 mt-0.5">{modalDetalhesTriagem.condicaoNutricional}</p>
                </div>
              )}
              {modalDetalhesTriagem.condicaoSocial && (
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Condição Social</span>
                  <p className="text-sm text-gray-900 mt-0.5">{modalDetalhesTriagem.condicaoSocial}</p>
                </div>
              )}
              {modalDetalhesTriagem.observacoes && (
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Observações</span>
                  <p className="text-sm text-gray-900 mt-0.5">{modalDetalhesTriagem.observacoes}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setModalDetalhesTriagem(null)}
                className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO DELETE */}
      {idParaExcluir !== null && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancelar consulta</h3>
                <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setIdParaExcluir(null); setModalAberto(true) }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={confirmarDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancelar Consulta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
