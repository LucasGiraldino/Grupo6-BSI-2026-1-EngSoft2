import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader, Clock } from 'lucide-react'
import Toast from '../components/Toast'
import api from '../services/api'

interface Profissional {
  id: number
  usuario: { id: number; nome: string }
  especialidade: string
}

interface AgendaSlot {
  id: number
  usuario: { id: number }
  data: string
  horaInicio: string
  horaFim: string
  disponivel: boolean
}

function formatarHora(hora: string) {
  return hora ? hora.substring(0, 5) : ''
}

function formatarData(d: string | undefined) {
  if (!d) return '-'
  const [ano, mes, dia] = d.substring(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

export default function GerenciarAgenda() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [slots, setSlots] = useState<AgendaSlot[]>([])
  const [carregando, setCarregando] = useState(false)

  const [formData, setFormData] = useState('')
  const [formHoraInicio, setFormHoraInicio] = useState('')
  const [formHoraFim, setFormHoraFim] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

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
      carregarSlots()
    } else {
      setSlots([])
    }
  }, [profissionalId])

  async function carregarProfissionais() {
    try {
      const res = await api.get('/api/profissionais')
      setProfissionais(res.data)
    } catch {}
  }

  async function carregarSlots() {
    if (!profissionalId) return
    setCarregando(true)
    try {
      const res = await api.get(`/api/agenda/profissional/${profissionalId}`)
      setSlots(res.data)
    } catch {
      setSlots([])
    }
    setCarregando(false)
  }

  function limparForm() {
    setFormData('')
    setFormHoraInicio('')
    setFormHoraFim('')
    setErroForm('')
  }

  async function adicionarSlot(e: React.FormEvent) {
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
      await api.post('/api/agenda', {
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
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/api/agenda/${idParaExcluir}`)
      mostrarToast('Horário removido com sucesso!', 'sucesso')
      carregarSlots()
    } catch {
      mostrarToast('Erro ao remover horário', 'erro')
    }
    setIdParaExcluir(null)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Gerenciar Agenda</h3>
      </div>

      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mr-3">Profissional:</label>
        <select
          value={profissionalId}
          onChange={e => { setProfissionalId(e.target.value); limparForm() }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] min-w-[300px]"
        >
          <option value="">Selecione um profissional</option>
          {profissionais.map(p => (
            <option key={p.id} value={p.id}>{p.usuario?.nome} - {p.especialidade}</option>
          ))}
        </select>
      </div>

      {profissionalId && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Horário
            </h4>
            <form onSubmit={adicionarSlot} className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
                <input
                  type="date"
                  value={formData}
                  onChange={e => setFormData(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hora Início</label>
                <input
                  type="time"
                  value={formHoraInicio}
                  onChange={e => setFormHoraInicio(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Hora Fim</label>
                <input
                  type="time"
                  value={formHoraFim}
                  onChange={e => setFormHoraFim(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={salvando}
                className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {salvando && <Loader className="w-4 h-4 animate-spin" />}
                Adicionar
              </button>
            </form>
            {erroForm && (
              <p className="text-sm text-red-500 mt-3">{erroForm}</p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Horários Cadastrados
                {slots.length > 0 && (
                  <span className="text-xs font-normal text-gray-400">({slots.length} registro{slots.length !== 1 ? 's' : ''})</span>
                )}
              </h4>
            </div>

            {carregando ? (
              <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : slots.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">
                Nenhum horário cadastrado para este profissional
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora Início</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hora Fim</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Disponível</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {slots.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 text-sm text-gray-900">{formatarData(s.data)}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{formatarHora(s.horaInicio)}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{formatarHora(s.horaFim)}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            s.disponivel ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {s.disponivel ? 'Sim' : 'Não'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => setIdParaExcluir(s.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover horário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!profissionalId && (
        <div className="flex-1 flex items-center justify-center text-gray-400 py-20">
          <div className="text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Selecione um profissional para gerenciar os horários</p>
          </div>
        </div>
      )}

      {idParaExcluir !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Remover Horário</h4>
                <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIdParaExcluir(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
