import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader } from 'lucide-react'
import api from '../services/api'

interface Prontuario {
  id: number
  paciente: { id: number; nome: string; cpf: string }
  dataAbertura: string
}

interface Medico {
  id: number
  usuario: { id: number; nome: string; email: string }
  crm: string
  especialidadeMedica: string
}

interface Receita {
  id: number
  dataEmissao: string
  descricao: string
  dataValidade: string
}

const FORM_VAZIO = { id: '', dataEmissao: '', descricao: '', dataValidade: '' }

export default function Receitas() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [carregando, setCarregando] = useState(true)

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [prontuarioId, setProntuarioId] = useState('')
  const [medicoId, setMedicoId] = useState('')
  const [erroForm, setErroForm] = useState('')

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  useEffect(() => {
    carregarReceitas()
    carregarProntuarios()
    carregarMedicos()
  }, [])

  async function carregarReceitas() {
    setCarregando(true)
    try {
      const res = await api.get('/api/receitas')
      setReceitas(res.data)
    } catch {}
    setCarregando(false)
  }

  async function carregarProntuarios() {
    try {
      const res = await api.get('/api/prontuarios')
      setProntuarios(res.data)
    } catch {}
  }

  async function carregarMedicos() {
    try {
      const res = await api.get('/api/triagens/medicos')
      setMedicos(res.data)
    } catch {}
  }

  function abrirModalNovo() {
    setForm(FORM_VAZIO)
    setProntuarioId('')
    setMedicoId('')
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(r: Receita) {
    setForm({
      id: String(r.id),
      dataEmissao: r.dataEmissao ? r.dataEmissao.substring(0, 16) : '',
      descricao: r.descricao ?? '',
      dataValidade: r.dataValidade ?? '',
    })
    setProntuarioId('')
    setMedicoId('')
    setErroForm('')
    setModalAberto(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!prontuarioId || !medicoId) {
      setErroForm('Selecione o prontuário e o médico.')
      return
    }
    const body = {
      dataEmissao: form.dataEmissao ? new Date(form.dataEmissao).toISOString() : null,
      descricao: form.descricao || null,
      dataValidade: form.dataValidade || null,
      prontuario: { id: parseInt(prontuarioId) },
      medico: { id: parseInt(medicoId) },
    }
    const url = form.id ? `/api/receitas/${form.id}` : '/api/receitas'
    const method = form.id ? 'PUT' : 'POST'
    try {
      await api({ url, method, data: body })
      setModalAberto(false)
      carregarReceitas()
    } catch (err: any) {
      const data = err.response?.data
      setErroForm(typeof data === 'string' ? data : data?.error || 'Erro ao salvar receita. Verifique os dados e tente novamente.')
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/api/receitas/${idParaExcluir}`)
    } catch {}
    setIdParaExcluir(null)
    carregarReceitas()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Receitas Médicas</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Receita
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data de Emissão</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data de Validade</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Carregando...
                </td>
              </tr>
            ) : receitas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Nenhuma receita registrada
                </td>
              </tr>
            ) : (
              receitas.map(r => (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{r.id}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.dataEmissao ? new Date(r.dataEmissao).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{r.descricao ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {r.dataValidade ? new Date(r.dataValidade).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModalEdicao(r)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIdParaExcluir(r.id)}
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

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Receita' : 'Nova Receita'}</h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prontuário</label>
                  <select
                    required
                    value={prontuarioId}
                    onChange={e => setProntuarioId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  >
                    <option value="">Selecione o prontuário</option>
                    {prontuarios.map(p => (
                      <option key={p.id} value={p.id}>
                        #{p.id} — {p.paciente?.nome ?? `Paciente #${p.paciente?.id}`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Médico</label>
                  <select
                    required
                    value={medicoId}
                    onChange={e => setMedicoId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  >
                    <option value="">Selecione o médico</option>
                    {medicos.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.usuario?.nome ?? `Médico #${m.id}`} ({m.crm})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão</label>
                    <input
                      type="datetime-local"
                      required
                      value={form.dataEmissao}
                      onChange={e => setForm(f => ({ ...f, dataEmissao: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                    <input
                      type="date"
                      required
                      value={form.dataValidade}
                      onChange={e => setForm(f => ({ ...f, dataValidade: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    required
                    rows={4}
                    value={form.descricao}
                    onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
                    placeholder="Descreva a prescrição médica..."
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

      {idParaExcluir !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Excluir receita</h3>
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
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
