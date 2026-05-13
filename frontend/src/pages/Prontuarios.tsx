import { useEffect, useState } from 'react'
import { Pencil, X, Loader, Search } from 'lucide-react'
import Toast from '../components/Toast'
import api from '../services/api'
import { formatarCpf } from '../utils/cpf'

interface Prontuario {
  id: number
  paciente: {
    id: number
    nome: string
    cpf: string
  }
  dataAbertura: string
  dataFechamento: string | null
  observacoesGerais: string | null
}

export default function Prontuarios() {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<Prontuario | null>(null)
  const [observacoes, setObservacoes] = useState('')
  const [dataFechamento, setDataFechamento] = useState('')
  const [erroForm, setErroForm] = useState('')

  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }

  useEffect(() => {
    carregarProntuarios()
  }, [])

  async function carregarProntuarios(q?: string) {
    setCarregando(true)
    try {
      const params = q ? `?q=${encodeURIComponent(q)}` : ''
      const res = await api.get(`/api/prontuarios${params}`)
      setProntuarios(res.data)
    } catch {}
    setCarregando(false)
  }

  function abrirModalEdicao(p: Prontuario) {
    setEditando(p)
    setObservacoes(p.observacoesGerais ?? '')
    setDataFechamento(p.dataFechamento ?? '')
    setErroForm('')
    setModalAberto(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!editando) return
    try {
      await api.put(`/api/prontuarios/${editando.id}`, {
        observacoesGerais: observacoes || null,
        dataFechamento: dataFechamento || null,
        paciente: { id: editando.paciente.id },
      })
      mostrarToast('Prontuário atualizado com sucesso!', 'sucesso')
      setModalAberto(false)
      carregarProntuarios(filtro)
    } catch {
      setErroForm('Erro ao salvar prontuário.')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Prontuários</h3>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou ID do prontuário..."
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && carregarProntuarios(filtro)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
          />
        </div>
        <button
          onClick={() => carregarProntuarios(filtro)}
          className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Buscar
        </button>
        <button
          onClick={() => { setFiltro(''); carregarProntuarios() }}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Abertura</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Carregando...
                </td>
              </tr>
            ) : prontuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Nenhum prontuário encontrado
                </td>
              </tr>
            ) : (
              prontuarios.map(p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.id}</td>
                  <td className="px-6 py-4 text-gray-600">{p.paciente?.nome ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{p.paciente?.cpf ? formatarCpf(p.paciente.cpf) : '-'}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {p.dataAbertura ? new Date(p.dataAbertura).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.dataFechamento ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {p.dataFechamento ? 'Fechado' : 'Ativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => abrirModalEdicao(p)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                      title="Editar prontuário"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL EDITAR */}
      {modalAberto && editando && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Prontuário #{editando.id} — {editando.paciente?.nome}
              </h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Abertura</span>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {editando.dataAbertura ? new Date(editando.dataAbertura).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</span>
                  <p className="text-sm text-gray-900 mt-0.5">
                    {editando.dataFechamento ? 'Fechado' : 'Ativo'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fechamento</label>
                <input
                  type="date"
                  value={dataFechamento}
                  onChange={e => setDataFechamento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
                <textarea
                  rows={5}
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
                  placeholder="Observações clínicas gerais do paciente..."
                />
              </div>

              {erroForm && (
                <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
              )}

              <div className="flex gap-3 pt-2">
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

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
