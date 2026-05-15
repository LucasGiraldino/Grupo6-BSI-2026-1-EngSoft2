import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader } from 'lucide-react'
import Toast from '../components/Toast'
import api from '../services/api'
import { formatarCpf } from '../utils/cpf'

interface Profissional {
  id: number
  usuario: { id: number; nome: string; email?: string; cpf?: string }
  endereco?: {
    id?: number
    cep: string
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cidade: string
    estado: string
    pais: string
  }
  especialidade: string
  registroProfissional: string
  dataAdmissao: string
  dataDemissao?: string
}

interface UsuarioItem {
  id: number
  nome: string
  email: string
  cpf: string
}

const FORM_VAZIO = {
  id: '',
  usuarioId: '',
  especialidade: '',
  registroProfissional: '',
  dataAdmissao: '',
  ehMedico: false,
}

export default function Profissionais() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([])
  const [carregando, setCarregando] = useState(true)

  const [filtroNome, setFiltroNome] = useState('')
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('')

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('erro')

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'erro') {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }

  useEffect(() => {
    carregarProfissionais()
    carregarUsuarios()
  }, [])

  async function carregarProfissionais(nome?: string, especialidade?: string) {
    setCarregando(true)
    try {
      const params = new URLSearchParams()
      if (nome) params.append('nome', nome)
      if (especialidade) params.append('especialidade', especialidade)
      const query = params.toString()
      const res = await api.get(`/api/profissionais${query ? `?${query}` : ''}`)
      setProfissionais(res.data)
    } catch {
      mostrarToast('Erro ao carregar profissionais', 'erro')
    }
    setCarregando(false)
  }

  async function carregarUsuarios() {
    try {
      const res = await api.get('/apis/user')
      setUsuarios(res.data)
    } catch {
      mostrarToast('Erro ao carregar usuários', 'erro')
    }
  }

  function abrirModalNovo() {
    setForm(FORM_VAZIO)
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(p: Profissional) {
    setForm({
      id: String(p.id),
      usuarioId: String(p.usuario.id),
      especialidade: p.especialidade,
      registroProfissional: p.registroProfissional,
      dataAdmissao: p.dataAdmissao,
      ehMedico: false,
    })
    setErroForm('')
    setModalAberto(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.usuarioId) {
      setErroForm('Selecione um usuário.')
      return
    }
    if (!form.especialidade.trim()) {
      setErroForm('Especialidade é obrigatória.')
      return
    }
    if (!form.registroProfissional.trim()) {
      setErroForm('Registro profissional é obrigatório.')
      return
    }
    if (!form.dataAdmissao) {
      setErroForm('Data de admissão é obrigatória.')
      return
    }

    const body = {
      usuario: { id: Number(form.usuarioId) },
      especialidade: form.especialidade.trim(),
      registroProfissional: form.registroProfissional.trim(),
      dataAdmissao: form.dataAdmissao,
      ehMedico: form.ehMedico,
    }

    try {
      if (form.id) {
        await api.put(`/api/profissionais/${form.id}`, body)
        mostrarToast('Profissional atualizado com sucesso!', 'sucesso')
      } else {
        await api.post('/api/profissionais', body)
        mostrarToast('Profissional cadastrado com sucesso!', 'sucesso')
      }
      setModalAberto(false)
      carregarProfissionais()
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErroForm('Este usuário já possui um profissional vinculado.')
      } else {
        setErroForm('Erro ao salvar profissional. Verifique os dados e tente novamente.')
      }
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/api/profissionais/${idParaExcluir}`)
      mostrarToast('Profissional desativado com sucesso!', 'sucesso')
    } catch {
      mostrarToast('Erro ao desativar profissional', 'erro')
    }
    setIdParaExcluir(null)
    carregarProfissionais()
  }

  const usuarioSelecionado = usuarios.find(u => String(u.id) === form.usuarioId)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Profissionais</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Novo Profissional
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filtroNome}
          onChange={e => setFiltroNome(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
        />
        <input
          type="text"
          placeholder="Buscar por especialidade..."
          value={filtroEspecialidade}
          onChange={e => setFiltroEspecialidade(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
        />
        <button
          onClick={() => carregarProfissionais(filtroNome, filtroEspecialidade)}
          className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Buscar
        </button>
        <button
          onClick={() => {
            setFiltroNome('')
            setFiltroEspecialidade('')
            carregarProfissionais()
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Especialidade</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registro Profissional</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data Admissão</th>
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
            ) : profissionais.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Nenhum profissional cadastrado
                </td>
              </tr>
            ) : (
              profissionais.map(p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.usuario.nome}</td>
                  <td className="px-6 py-4 text-gray-600">{p.especialidade}</td>
                  <td className="px-6 py-4 text-gray-600">{p.registroProfissional}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(p.dataAdmissao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.dataDemissao ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {p.dataDemissao ? 'Demitido' : 'Ativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModalEdicao(p)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIdParaExcluir(p.id)}
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

      {/* MODAL CRIAR/EDITAR */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {form.id ? 'Editar Profissional' : 'Novo Profissional'}
              </h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                  <select
                    required
                    value={form.usuarioId}
                    onChange={e => setForm(f => ({ ...f, usuarioId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
                  >
                    <option value="">Selecione um usuário...</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={String(u.id)}>
                        {u.nome} - {u.email}
                      </option>
                    ))}
                  </select>
                  {usuarioSelecionado && (
                    <p className="mt-1 text-xs text-gray-400">
                      CPF: {formatarCpf(usuarioSelecionado.cpf || '')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cardiologia"
                    value={form.especialidade}
                    onChange={e => setForm(f => ({ ...f, especialidade: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registro Profissional</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CRM/SP 123456"
                    value={form.registroProfissional}
                    onChange={e => setForm(f => ({ ...f, registroProfissional: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ehMedico"
                    checked={form.ehMedico}
                    onChange={e => setForm(f => ({ ...f, ehMedico: e.target.checked }))}
                    className="w-4 h-4 text-[#030213] border-gray-300 rounded focus:ring-[#030213]"
                  />
                  <label htmlFor="ehMedico" className="text-sm font-medium text-gray-700">
                    É médico?
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão</label>
                  <input
                    type="date"
                    required
                    value={form.dataAdmissao}
                    onChange={e => setForm(f => ({ ...f, dataAdmissao: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
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
                <h3 className="text-lg font-semibold text-gray-900">Desativar profissional</h3>
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
                Desativar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
