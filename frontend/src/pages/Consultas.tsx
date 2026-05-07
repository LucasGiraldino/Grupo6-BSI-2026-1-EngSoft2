import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader } from 'lucide-react'

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

interface Consulta {
  id: number
  paciente: Paciente
  profissional: Profissional
  agenda: {
    id: number
    data: string
    horaInicio: string
    horaFim: string
  }
  tipoConsulta: string
  status: string
  observacoes?: string
  dataAgendamento: string
}

const STATUS_CORES: Record<string, string> = {
  AGENDADA: 'bg-blue-100 text-blue-700',
  CONCLUIDA: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-red-100 text-red-700',
}

const FORM_VAZIO = { id: '', idPaciente: '', idProfissional: '', dataConsulta: '', idAgenda: '', tipoConsulta: '', observacoes: '' }

export default function Consultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [agendasDisponiveis, setAgendasDisponiveis] = useState<AgendaDisponivel[]>([])
  const [carregando, setCarregando] = useState(true)

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  useEffect(() => {
    carregarConsultas()
    carregarPacientes()
    carregarProfissionais()
  }, [])

  async function carregarConsultas() {
    setCarregando(true)
    try {
      const res = await fetch('/api/consultas')
      setConsultas(await res.json())
    } catch {}
    setCarregando(false)
  }

  async function carregarPacientes() {
    try {
      const res = await fetch('/api/pacientes')
      setPacientes(await res.json())
    } catch {}
  }

  async function carregarProfissionais() {
    try {
      const res = await fetch('/api/profissionais')
      setProfissionais(await res.json())
    } catch {}
  }

  function abrirModalNovo() {
    setForm(FORM_VAZIO)
    setAgendasDisponiveis([])
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(c: Consulta) {
    setForm({
      id: String(c.id),
      idPaciente: String(c.paciente.id),
      idProfissional: String(c.profissional.id),
      dataConsulta: c.agenda.data ? c.agenda.data.substring(0, 10) : '',
      idAgenda: String(c.agenda.id || ''),
      tipoConsulta: c.tipoConsulta || '',
      observacoes: c.observacoes ?? '',
    })
    setAgendasDisponiveis([])
    setErroForm('')
    setModalAberto(true)
  }

  function handleProfissionalChange(valor: string) {
    setForm(f => ({ ...f, idProfissional: valor, idAgenda: '', dataConsulta: '' }))
    setAgendasDisponiveis([])
  }

  function handleDataChange(valor: string) {
    setForm(f => ({ ...f, dataConsulta: valor, idAgenda: '' }))
    if (form.idProfissional && valor) {
      fetch(`/api/agenda/disponivel?data=${valor}&idProfissional=${form.idProfissional}`)
        .then(res => res.json())
        .then(data => setAgendasDisponiveis(data))
        .catch(() => setAgendasDisponiveis([]))
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.idPaciente || !form.idProfissional || !form.idAgenda || !form.tipoConsulta) {
      setErroForm('Preencha todos os campos obrigatórios.')
      return
    }
    const body = {
      idPaciente: parseInt(form.idPaciente),
      idProfissional: parseInt(form.idProfissional),
      idAgenda: parseInt(form.idAgenda),
      tipoConsulta: form.tipoConsulta,
      observacoes: form.observacoes || null,
      status: 'AGENDADA',
      dataAgendamento: new Date().toISOString(),
    }
    const url = form.id ? `/api/consultas/${form.id}` : '/api/consultas'
    try {
      const res = await fetch(url, {
        method: form.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error()
      setModalAberto(false)
      carregarConsultas()
    } catch {
      setErroForm('Erro ao salvar consulta. Verifique os dados e tente novamente.')
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await fetch(`/api/consultas/${idParaExcluir}`, { method: 'DELETE' })
    } catch {}
    setIdParaExcluir(null)
    carregarConsultas()
  }

  function formatarHora(hora: string) {
    return hora ? hora.substring(0, 5) : ''
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Consultas" subtitle="Associação do Câncer - Gestão Integrada" />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Agendamento de Consultas</h3>
            <button
              onClick={abrirModalNovo}
              className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Nova Consulta
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Profissional</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Horário</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                      Carregando...
                    </td>
                  </tr>
                ) : consultas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Nenhuma consulta agendada
                    </td>
                  </tr>
                ) : (
                  consultas.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{c.paciente?.nome ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{c.profissional?.usuario?.nome ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {c.agenda?.data ? new Date(c.agenda.data).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {c.agenda ? `${formatarHora(c.agenda.horaInicio)} - ${formatarHora(c.agenda.horaFim)}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{c.tipoConsulta ?? '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_CORES[c.status] || 'bg-gray-100 text-gray-700'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEdicao(c)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIdParaExcluir(c.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* MODAL CRIAR/EDITAR */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Consulta' : 'Agendar Nova Consulta'}</h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profissional</label>
                    <select
                      required
                      value={form.idProfissional}
                      onChange={e => handleProfissionalChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    >
                      <option value="">Selecione o profissional</option>
                      {profissionais.map(p => (
                        <option key={p.id} value={p.id}>{p.usuario?.nome} - {p.especialidade}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data da Consulta</label>
                    <input
                      type="date"
                      required
                      value={form.dataConsulta}
                      onChange={e => handleDataChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horário Disponível</label>
                    <select
                      required
                      value={form.idAgenda}
                      onChange={e => setForm(f => ({ ...f, idAgenda: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      disabled={!form.idProfissional || !form.dataConsulta}
                    >
                      <option value="">{!form.idProfissional || !form.dataConsulta ? 'Selecione profissional e data' : 'Selecione o horário'}</option>
                      {agendasDisponiveis.map(a => (
                        <option key={a.id} value={a.id}>
                          {formatarHora(a.horaInicio)} às {formatarHora(a.horaFim)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                    <select
                      required
                      value={form.idPaciente}
                      onChange={e => setForm(f => ({ ...f, idPaciente: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    >
                      <option value="">Selecione o paciente</option>
                      {pacientes.map(p => (
                        <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Consulta</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Psicologia, Fisioterapia"
                    value={form.tipoConsulta}
                    onChange={e => setForm(f => ({ ...f, tipoConsulta: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                  <textarea
                    rows={2}
                    placeholder="Observações sobre a consulta..."
                    value={form.observacoes}
                    onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
                  />
                </div>

                {erroForm && (
                  <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
                )}
              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO DELETE */}
      {idParaExcluir !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
                onClick={() => setIdParaExcluir(null)}
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
