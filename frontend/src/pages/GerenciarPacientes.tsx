import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader, Search } from 'lucide-react'
import Toast from '../components/Toast'
import api from '../services/api'
import { validarCpf, limparCpf, formatarCpf } from '../utils/cpf'
import { formatarTelefone, limparTelefone, formatarCep, limparCep, validarTelefone } from '../utils/validators'

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

interface Paciente {
  id: number
  nome: string
  cpf: string
  dataNascimento: string
  sexo: string
  telefone?: string
  email?: string
  restricoesAlimentares?: string
  dataCadastro: string
  endereco?: Endereco
}

const SEXOS = ['MASCULINO', 'FEMININO', 'OUTRO']

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

const FORM_VAZIO = {
  id: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  email: '',
  restricoesAlimentares: '',
  enderecoCep: '',
  enderecoLogradouro: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoEstado: '',
  enderecoPais: 'Brasil',
}

export default function GerenciarPacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [carregando, setCarregando] = useState(true)

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [errosCampos, setErrosCampos] = useState<Record<string, string>>({})

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('erro')
  const [buscandoCpf, setBuscandoCpf] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroCpf, setFiltroCpf] = useState('')

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'erro') {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }

  function temErro(campo: string): string {
    return errosCampos[campo] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#030213]'
  }

  useEffect(() => {
    carregarPacientes()
  }, [])

  async function buscarDadosPorCpf(cpf: string) {
    if (cpf.length !== 11) return
    setBuscandoCpf(true)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const res = await api.get(`/api/consulta-cpf/${cpf}`, { signal: controller.signal })
      clearTimeout(timeout)
      const data = res.data
      if (data.valido) {
        if (data.nome) {
          setForm(f => ({ ...f, nome: data.nome }))
          mostrarToast('Dados encontrados para o CPF informado!', 'sucesso')
        }
        if (data.dataNascimento) {
          const partes = data.dataNascimento.split('/')
          if (partes.length === 3) {
            setForm(f => ({ ...f, dataNascimento: `${partes[2]}-${partes[1]}-${partes[0]}` }))
          }
        }
        if (data.sexo) {
          setForm(f => ({ ...f, sexo: data.sexo }))
        }
        if (!data.nome) {
          mostrarToast('CPF v\u00e1lido!', 'sucesso')
        }
      } else {
        mostrarToast(data.mensagem || 'CPF inv\u00e1lido. Verifique os d\u00edgitos e tente novamente.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CPF. Verifique se o servidor est\u00e1 rodando.', 'erro')
    } finally {
      setBuscandoCpf(false)
    }
  }

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

  async function carregarPacientes(nome?: string, cpf?: string) {
    setCarregando(true)
    try {
      const params = new URLSearchParams()
      if (nome) params.append('nome', nome)
      if (cpf) params.append('cpf', cpf)
      const query = params.toString()
      const res = await api.get(`/api/pacientes${query ? `?${query}` : ''}`)
      setPacientes(res.data)
    } catch {}
    setCarregando(false)
  }

  function abrirModalNovo() {
    setForm(FORM_VAZIO)
    setErroForm('')
    setErrosCampos({})
    setModalAberto(true)
  }

  function abrirModalEdicao(p: Paciente) {
    setForm({
      id: String(p.id),
      nome: p.nome,
      cpf: p.cpf,
      dataNascimento: p.dataNascimento,
      sexo: p.sexo,
      telefone: p.telefone ?? '',
      email: p.email ?? '',
      restricoesAlimentares: p.restricoesAlimentares ?? '',
      enderecoCep: p.endereco?.cep ?? '',
      enderecoLogradouro: p.endereco?.logradouro ?? '',
      enderecoNumero: p.endereco?.numero ?? '',
      enderecoComplemento: p.endereco?.complemento ?? '',
      enderecoBairro: p.endereco?.bairro ?? '',
      enderecoCidade: p.endereco?.cidade ?? '',
      enderecoEstado: p.endereco?.estado ?? '',
      enderecoPais: p.endereco?.pais ?? 'Brasil',
    })
    setErroForm('')
    setErrosCampos({})
    setModalAberto(true)
  }

  function limparErro(campo: string) {
    setErrosCampos(e => { const n = { ...e }; delete n[campo]; return n })
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()

    const campos: Record<string, string> = {
      nome: 'Nome',
      cpf: 'CPF',
      dataNascimento: 'Data de Nascimento',
      sexo: 'Sexo',
      telefone: 'Telefone',
      email: 'E-mail',
      restricoesAlimentares: 'Restrições Alimentares',
      enderecoCep: 'CEP',
      enderecoLogradouro: 'Logradouro',
      enderecoNumero: 'Número',
      enderecoBairro: 'Bairro',
      enderecoCidade: 'Cidade',
      enderecoEstado: 'Estado',
      enderecoPais: 'País',
    }

    const erros: Record<string, string> = {}
    for (const [chave, rotulo] of Object.entries(campos)) {
      const valor = form[chave as keyof typeof form]
      if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
        erros[chave] = `${rotulo} é obrigatório.`
      }
    }

    if (form.cpf && !validarCpf(form.cpf)) {
      erros.cpf = 'CPF inválido. Verifique os dígitos.'
    }

    if (form.telefone && !validarTelefone(form.telefone)) {
      erros.telefone = 'Telefone inválido. Deve ter 10 ou 11 dígitos.'
    }

    if (Object.keys(erros).length > 0) {
      setErrosCampos(erros)
      setErroForm('Preencha todos os campos obrigatórios corretamente.')
      return
    }
    setErrosCampos({})
    const body = {
      nome: form.nome,
      cpf: limparCpf(form.cpf),
      dataNascimento: form.dataNascimento,
      sexo: form.sexo,
      telefone: limparTelefone(form.telefone) || null,
      email: form.email || null,
      restricoesAlimentares: form.restricoesAlimentares || null,
      endereco: {
        cep: limparCep(form.enderecoCep),
        logradouro: form.enderecoLogradouro,
        numero: form.enderecoNumero,
        complemento: form.enderecoComplemento || null,
        bairro: form.enderecoBairro,
        cidade: form.enderecoCidade,
        estado: form.enderecoEstado,
        pais: form.enderecoPais,
      },
    }
    try {
      if (form.id) {
        await api.put(`/api/pacientes/${form.id}`, body)
        mostrarToast('Paciente atualizado com sucesso!', 'sucesso')
      } else {
        await api.post('/api/pacientes', body)
        mostrarToast('Paciente cadastrado com sucesso!', 'sucesso')
      }
      setModalAberto(false)
      carregarPacientes()
    } catch {
      setErroForm('Erro ao salvar paciente. Verifique os dados e tente novamente.')
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/api/pacientes/${idParaExcluir}`)
      mostrarToast('Paciente excluído com sucesso!', 'sucesso')
    } catch {}
    setIdParaExcluir(null)
    carregarPacientes()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Lista de Pacientes</h3>
            <button
              onClick={abrirModalNovo}
              className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Novo Paciente
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
              placeholder="Buscar por CPF..."
              value={formatarCpf(filtroCpf)}
              onChange={e => setFiltroCpf(limparCpf(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-48"
            />
            <button
              onClick={() => carregarPacientes(filtroNome, filtroCpf)}
              className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Buscar
            </button>
            <button
              onClick={() => {
                setFiltroNome('')
                setFiltroCpf('')
                carregarPacientes()
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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data Nasc.</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sexo</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade/UF</th>
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
                ) : pacientes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Nenhum paciente cadastrado
                    </td>
                  </tr>
                ) : (
                  pacientes.map(p => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.nome}</td>
                      <td className="px-6 py-4 text-gray-600">{formatarCpf(p.cpf)}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(p.dataNascimento).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {p.sexo === 'MASCULINO' ? 'Masculino' : p.sexo === 'FEMININO' ? 'Feminino' : 'Outro'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.telefone ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {p.endereco ? `${p.endereco.cidade}/${p.endereco.estado}` : '-'}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Paciente' : 'Novo Paciente'}</h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
                {/* Dados Pessoais */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Dados Pessoais</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        type="text"
                        required
                        placeholder="Nome completo"
                        value={form.nome}
                        onChange={e => { setForm(f => ({ ...f, nome: e.target.value })); limparErro('nome') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('nome')}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="000.000.000-00"
                          value={formatarCpf(form.cpf)}
                          onChange={e => { setForm(f => ({ ...f, cpf: limparCpf(e.target.value) })); limparErro('cpf') }}
                          onBlur={() => !form.id && buscarDadosPorCpf(limparCpf(form.cpf))}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('cpf')}`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {buscandoCpf ? (
                            <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                      <input
                        type="date"
                        required
                        value={form.dataNascimento}
                        onChange={e => { setForm(f => ({ ...f, dataNascimento: e.target.value })); limparErro('dataNascimento') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('dataNascimento')}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                      <select
                        required
                        value={form.sexo}
                        onChange={e => { setForm(f => ({ ...f, sexo: e.target.value })); limparErro('sexo') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('sexo')}`}
                      >
                        <option value="">Selecione...</option>
                        {SEXOS.map(s => (
                          <option key={s} value={s}>{s === 'MASCULINO' ? 'Masculino' : s === 'FEMININO' ? 'Feminino' : 'Outro'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <input
                        type="text"
                        placeholder="(11) 99999-9999"
                        value={formatarTelefone(form.telefone)}
                        onChange={e => { setForm(f => ({ ...f, telefone: e.target.value.replace(/\D/g, '') })); limparErro('telefone') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('telefone')}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="paciente@email.com"
                        value={form.email}
                        onChange={e => { setForm(f => ({ ...f, email: e.target.value })); limparErro('email') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('email')}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Endereço</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="00000-000"
                          value={formatarCep(form.enderecoCep)}
                          onChange={e => { setForm(f => ({ ...f, enderecoCep: limparCep(e.target.value) })); limparErro('enderecoCep') }}
                          onBlur={() => buscarDadosPorCep(limparCep(form.enderecoCep))}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoCep')}`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          {buscandoCep ? (
                            <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                      <input
                        type="text"
                        required
                        value={form.enderecoPais}
                        onChange={e => { setForm(f => ({ ...f, enderecoPais: e.target.value })); limparErro('enderecoPais') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoPais')}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                      <input
                        type="text"
                        required
                        placeholder="Rua, Avenida..."
                        value={form.enderecoLogradouro}
                        onChange={e => { setForm(f => ({ ...f, enderecoLogradouro: e.target.value })); limparErro('enderecoLogradouro') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoLogradouro')}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={form.enderecoNumero}
                        onChange={e => { setForm(f => ({ ...f, enderecoNumero: e.target.value })); limparErro('enderecoNumero') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoNumero')}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                      <input
                        type="text"
                        placeholder="Apto, Bloco..."
                        value={form.enderecoComplemento}
                        onChange={e => setForm(f => ({ ...f, enderecoComplemento: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        required
                        placeholder="Centro"
                        value={form.enderecoBairro}
                        onChange={e => { setForm(f => ({ ...f, enderecoBairro: e.target.value })); limparErro('enderecoBairro') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoBairro')}`}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                        <input
                          type="text"
                          required
                          placeholder="São Paulo"
                          value={form.enderecoCidade}
                        onChange={e => { setForm(f => ({ ...f, enderecoCidade: e.target.value })); limparErro('enderecoCidade') }}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoCidade')}`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                          required
                          value={form.enderecoEstado}
                          onChange={e => { setForm(f => ({ ...f, enderecoEstado: e.target.value })); limparErro('enderecoEstado') }}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoEstado')}`}
                        >
                          <option value="">UF</option>
                          {ESTADOS.map(uf => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Observações */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Informações Adicionais</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restrições Alimentares</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva as restrições alimentares do paciente..."
                      value={form.restricoesAlimentares}
                      onChange={e => { setForm(f => ({ ...f, restricoesAlimentares: e.target.value })); limparErro('restricoesAlimentares') }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('restricoesAlimentares')}`}
                    />
                  </div>
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
                <h3 className="text-lg font-semibold text-gray-900">Excluir paciente</h3>
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

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
