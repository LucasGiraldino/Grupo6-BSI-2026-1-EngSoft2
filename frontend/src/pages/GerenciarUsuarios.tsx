import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader } from 'lucide-react'
import Toast from '../components/Toast'
import api from '../services/api'
import { validarCpf, limparCpf, formatarCpf } from '../utils/cpf'
import {
  validarEmail,
  formatarTelefone,
  limparTelefone,
  formatarCep,
  limparCep,
} from '../utils/validators'

interface Endereco {
  id?: number
  cep: string
  logradouro: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  pais: string
  descricao?: string
}

interface Usuario {
  id: number
  nome: string
  email: string
  cpf: string
  perfil: string
  ativo: boolean
  dataCadastro: string
  dataNascimento?: string
  telefone?: string
  endereco?: Endereco
}

interface ErroForm {
  campo?: string
  mensagem: string
}

const PERFIS = ['USUARIO', 'ADMIN']

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

const FORM_VAZIO = {
  nome: '',
  email: '',
  cpf: '',
  senha: '',
  perfil: 'USUARIO',
  dataNascimento: '',
  telefone: '',
  enderecoCep: '',
  enderecoLogradouro: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoEstado: '',
  enderecoPais: 'Brasil',
}

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState({ ...FORM_VAZIO })
  const [erroForm, setErroForm] = useState<ErroForm | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)
  const [filtroSearch, setFiltroSearch] = useState('')
  const [filtroPerfil, setFiltroPerfil] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)

  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')
  const [editandoId, setEditandoId] = useState<number | null>(null)

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function buscarDadosPorCep(cep: string) {
    if (cep.length !== 8) return
    setBuscandoCep(true)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const res = await api.get(`/api/consulta-cep/${cep}`, { signal: controller.signal })
      clearTimeout(timeout)
      const data = res.data
      if (data.valido) {
        setForm(f => ({
          ...f,
          enderecoLogradouro: data.logradouro ?? f.enderecoLogradouro,
          enderecoBairro: data.bairro ?? f.enderecoBairro,
          enderecoCidade: data.localidade ?? f.enderecoCidade,
          enderecoEstado: data.uf ?? f.enderecoEstado,
          enderecoComplemento: data.complemento ?? f.enderecoComplemento,
        }))
        mostrarToast('Endereço encontrado para o CEP informado!', 'sucesso')
      } else {
        mostrarToast(data.mensagem || 'CEP não encontrado.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CEP.', 'erro')
    } finally {
      setBuscandoCep(false)
    }
  }

  async function carregarUsuarios(search?: string, perfil?: string) {
    setCarregando(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (perfil) params.append('perfil', perfil)
      const query = params.toString()
      const res = await api.get(`/apis/user${query ? `?${query}` : ''}`)
      setUsuarios(res.data)
    } catch {
      mostrarToast('Erro ao carregar usuários', 'erro')
    }
    setCarregando(false)
  }

  function abrirModalNovo() {
    setEditandoId(null)
    setForm({ ...FORM_VAZIO })
    setErroForm(null)
    setModalAberto(true)
  }

  function abrirModalEdicao(usuario: Usuario) {
    setEditandoId(usuario.id)
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      senha: '',
      perfil: usuario.perfil === 'ADMINISTRADOR' ? 'ADMIN' : usuario.perfil,
      dataNascimento: usuario.dataNascimento ?? '',
      telefone: usuario.telefone ?? '',
      enderecoCep: usuario.endereco?.cep ?? '',
      enderecoLogradouro: usuario.endereco?.logradouro ?? '',
      enderecoNumero: usuario.endereco?.numero ?? '',
      enderecoComplemento: usuario.endereco?.complemento ?? '',
      enderecoBairro: usuario.endereco?.bairro ?? '',
      enderecoCidade: usuario.endereco?.cidade ?? '',
      enderecoEstado: usuario.endereco?.estado ?? '',
      enderecoPais: usuario.endereco?.pais ?? 'Brasil',
    })
    setErroForm(null)
    setModalAberto(true)
  }

  function validarForm(): boolean {
    if (!form.nome.trim()) {
      setErroForm({ campo: 'nome', mensagem: 'Nome é obrigatório' })
      return false
    }
    if (!form.email.trim()) {
      setErroForm({ campo: 'email', mensagem: 'Email é obrigatório' })
      return false
    }
    if (!validarEmail(form.email)) {
      setErroForm({ campo: 'email', mensagem: 'Email inválido' })
      return false
    }
    if (limparCpf(form.cpf).length !== 11) {
      setErroForm({ campo: 'cpf', mensagem: 'CPF deve ter 11 dígitos' })
      return false
    }
    if (!validarCpf(form.cpf)) {
      setErroForm({ campo: 'cpf', mensagem: 'CPF inválido. Verifique os dígitos.' })
      return false
    }
    if (!editandoId && form.senha.length < 6) {
      setErroForm({ campo: 'senha', mensagem: 'Senha deve ter no mínimo 6 caracteres' })
      return false
    }
    if (editandoId && form.senha.length > 0 && form.senha.length < 6) {
      setErroForm({ campo: 'senha', mensagem: 'Senha deve ter no mínimo 6 caracteres' })
      return false
    }
    return true
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!validarForm()) return

    setSalvando(true)
    try {
      const payload: Record<string, string> = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        cpf: limparCpf(form.cpf),
        perfil: form.perfil,
        dataNascimento: form.dataNascimento,
        telefone: limparTelefone(form.telefone),
        enderecoCep: limparCep(form.enderecoCep),
        enderecoLogradouro: form.enderecoLogradouro,
        enderecoNumero: form.enderecoNumero,
        enderecoComplemento: form.enderecoComplemento,
        enderecoBairro: form.enderecoBairro,
        enderecoCidade: form.enderecoCidade,
        enderecoEstado: form.enderecoEstado,
        enderecoPais: form.enderecoPais,
      }
      if (form.senha) {
        payload.senha = form.senha
      }

      if (editandoId) {
        await api.put(`/apis/user/${editandoId}`, payload)
        mostrarToast('Usuário atualizado com sucesso!', 'sucesso')
      } else {
        payload.senha = form.senha
        await api.post('/apis/user', payload)
        mostrarToast('Usuário criado com sucesso!', 'sucesso')
      }
      setEditandoId(null)
      setModalAberto(false)
      carregarUsuarios()
    } catch (err: any) {
      const msg = err.response?.data?.error || (editandoId ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário')
      setErroForm({ mensagem: msg })
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/apis/user/${idParaExcluir}`)
      setUsuarios(prev => prev.map(u => u.id === idParaExcluir ? { ...u, ativo: false } : u))
      mostrarToast('Usuário desativado com sucesso', 'sucesso')
    } catch {
      mostrarToast('Erro ao desativar usuário', 'erro')
    }
    setIdParaExcluir(null)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Gerenciar Usuários</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={filtroSearch}
          onChange={e => setFiltroSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
        />
        <select
          value={filtroPerfil}
          onChange={e => setFiltroPerfil(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
        >
          <option value="">Todos</option>
          {PERFIS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={() => carregarUsuarios(filtroSearch, filtroPerfil)}
          className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Buscar
        </button>
        <button
          onClick={() => {
            setFiltroSearch('')
            setFiltroPerfil('')
            carregarUsuarios()
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>
      </div>

      {carregando ? (
        <div className="flex justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfil</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cadastro</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.nome}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-mono">{formatarCpf(u.cpf)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.telefone ? formatarTelefone(u.telefone) : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.perfil === 'ADMINISTRADOR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.perfil}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.dataCadastro ? new Date(u.dataCadastro).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="px-4 py-3 text-right">
                      {u.ativo && (
                        <>
                          <button
                            onClick={() => abrirModalEdicao(u)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                            title="Editar usuário"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIdParaExcluir(u.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Desativar usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900">{editandoId ? 'Editar Usuário' : 'Novo Usuário'}</h4>
              <button onClick={() => { setModalAberto(false); setEditandoId(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={salvar} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    placeholder="Nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={formatarCpf(form.cpf)}
                    onChange={e => setForm(f => ({ ...f, cpf: limparCpf(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] font-mono"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    value={form.dataNascimento}
                    onChange={e => setForm(f => ({ ...f, dataNascimento: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formatarTelefone(form.telefone)}
                    onChange={e => setForm(f => ({ ...f, telefone: limparTelefone(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha {editandoId && <span className="text-gray-400 font-normal">(deixe em branco para manter)</span>}
                  </label>
                  <input
                    type="password"
                    value={form.senha}
                    onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    placeholder={editandoId ? "Nova senha (opcional)" : "Mínimo 6 caracteres"}
                    required={!editandoId}
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
                {usuarios.length === 0 ? (
                  <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">ADMIN</span>
                    <span>Primeiro usuário será ADMIN</span>
                  </div>
                ) : (
                  <select
                    value={form.perfil}
                    onChange={e => setForm(f => ({ ...f, perfil: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
                  >
                    {PERFIS.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Endereço</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatarCep(form.enderecoCep)}
                        onChange={e => setForm(f => ({ ...f, enderecoCep: limparCep(e.target.value) }))}
                        onBlur={() => buscarDadosPorCep(limparCep(form.enderecoCep))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                        placeholder="00000-000"
                      />
                      {buscandoCep && (
                        <Loader className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                    <input
                      type="text"
                      value={form.enderecoLogradouro}
                      onChange={e => setForm(f => ({ ...f, enderecoLogradouro: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      placeholder="Rua, Avenida..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                    <input
                      type="text"
                      value={form.enderecoNumero}
                      onChange={e => setForm(f => ({ ...f, enderecoNumero: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      placeholder="Nº"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={form.enderecoComplemento}
                      onChange={e => setForm(f => ({ ...f, enderecoComplemento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      placeholder="Apto, Bloco..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={form.enderecoBairro}
                      onChange={e => setForm(f => ({ ...f, enderecoBairro: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      placeholder="Bairro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      value={form.enderecoCidade}
                      onChange={e => setForm(f => ({ ...f, enderecoCidade: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      value={form.enderecoEstado}
                      onChange={e => setForm(f => ({ ...f, enderecoEstado: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
                    >
                      <option value="">Selecione</option>
                      {ESTADOS.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input
                      type="text"
                      value={form.enderecoPais}
                      onChange={e => setForm(f => ({ ...f, enderecoPais: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      placeholder="Brasil"
                    />
                  </div>
                </div>
              </div>

              {erroForm && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-sm text-red-700">{erroForm.mensagem}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setModalAberto(false); setEditandoId(null); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-6 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {salvando && <Loader className="w-4 h-4 animate-spin" />}
                  {salvando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {idParaExcluir !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Desativar Usuário</h4>
            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja desativar este usuário? Ele não poderá mais acessar o sistema.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIdParaExcluir(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
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
