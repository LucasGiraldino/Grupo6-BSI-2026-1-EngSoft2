import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, CalendarDays, User as UserIcon, Loader } from 'lucide-react'
import Toast from '../components/Toast'
import api from '../services/api'

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

interface SlotDetalhado extends AgendaDisponivel {
  profissionalNome: string
  profissionalEspecialidade: string
}

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

export default function VerificarHorarios() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [mesAtual, setMesAtual] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [slotsMes, setSlotsMes] = useState<AgendaDisponivel[]>([])
  const [carregandoProfissionais, setCarregandoProfissionais] = useState(true)
  const [carregandoMes, setCarregandoMes] = useState(false)
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null)
  const [slotExpandido, setSlotExpandido] = useState<SlotDetalhado | null>(null)

  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }

  useEffect(() => {
    carregarProfissionais()
  }, [])

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
  }, [profissionalId, mesAtual])

  async function carregarProfissionais() {
    setCarregandoProfissionais(true)
    try {
      const res = await api.get('/api/profissionais')
      setProfissionais(res.data)
    } catch {
      mostrarToast('Erro ao carregar profissionais', 'erro')
    } finally {
      setCarregandoProfissionais(false)
    }
  }

  function carregarDadosMes() {
    if (!profissionalId) return
    setCarregandoMes(true)
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth() + 1

    api.get('/api/agenda/disponivel/mes', { params: { idProfissional: profissionalId, ano, mes } })
      .then(r => setSlotsMes(r.data))
      .catch(() => {
        setSlotsMes([])
        mostrarToast('Erro ao carregar horários disponíveis', 'erro')
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

  function horariosDoDia(chave: string) {
    return slotsMes.filter(s => s.data === chave)
  }

  function selecionarSlot(slot: AgendaDisponivel) {
    const prof = profissionais.find(p => String(p.id) === profissionalId)
    const detalhado: SlotDetalhado = {
      ...slot,
      profissionalNome: prof?.usuario?.nome ?? '-',
      profissionalEspecialidade: prof?.especialidade ?? '-',
    }
    setSlotExpandido(slotExpandido?.id === slot.id ? null : detalhado)
  }

  const ano = mesAtual.getFullYear()
  const mes = mesAtual.getMonth()
  const semanas = getDiasMes()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Verificar Horários Disponíveis</h3>
      </div>

      <div className="flex items-center justify-between mb-6 bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Profissional:</label>
          {carregandoProfissionais ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader className="w-4 h-4 animate-spin" />
              Carregando...
            </div>
          ) : (
            <select
              value={profissionalId}
              onChange={e => setProfissionalId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] min-w-[250px]"
            >
              <option value="">Selecione um profissional</option>
              {profissionais.map(p => (
                <option key={p.id} value={p.id}>{p.usuario?.nome} - {p.especialidade}</option>
              ))}
            </select>
          )}
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
            <p className="text-lg">Selecione um profissional para ver os horários disponíveis</p>
          </div>
        </div>
      ) : (
        <div className="flex gap-6 flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-h-0">
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
                        onClick={() => setDiaSelecionado(selecionado ? null : chave)}
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

            {diaSelecionado && (
              <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Horários Disponíveis — {formatarData(diaSelecionado)}
                </h4>
                {(() => {
                  const slots = horariosDoDia(diaSelecionado)
                  if (slots.length === 0) {
                    return <p className="text-sm text-gray-400 py-4 text-center">Nenhum horário disponível neste dia</p>
                  }
                  return (
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div key={slot.id}>
                          <button
                            onClick={() => selecionarSlot(slot)}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-sm font-medium text-gray-700">
                                {formatarHora(slot.horaInicio)} — {formatarHora(slot.horaFim)}
                              </span>
                            </div>
                            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                              {slotExpandido?.id === slot.id ? 'Ocultar' : 'Detalhes'}
                            </span>
                          </button>
                          {slotExpandido?.id === slot.id && (
                            <div className="mx-4 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <UserIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-900">{slotExpandido.profissionalNome}</span>
                                <span className="text-gray-400">—</span>
                                <span>{slotExpandido.profissionalEspecialidade}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CalendarDays className="w-4 h-4 text-gray-400" />
                                <span>{formatarData(slotExpandido.data)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{formatarHora(slotExpandido.horaInicio)} às {formatarHora(slotExpandido.horaFim)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </div>
  )
}
