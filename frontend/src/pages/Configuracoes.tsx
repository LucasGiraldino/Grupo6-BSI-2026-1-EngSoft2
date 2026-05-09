import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import { Loader, Search } from 'lucide-react'
import Toast from '../components/Toast'

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

const FORM_VAZIO = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  telefone: '',
  email: '',
  site: '',
  dataFundacao: '',
  logoUrl: '',
  observacoes: '',
  enderecoCep: '',
  enderecoLogradouro: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoEstado: '',
}

function limparCnpj(valor: string) {
  return valor.replace(/\D/g, '').slice(0, 14)
}

function formatarCnpj(valor: string) {
  const digits = limparCnpj(valor)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

function limparCep(valor: string) {
  return valor.replace(/\D/g, '').slice(0, 8)
}

function formatarCep(valor: string) {
  const digits = limparCep(valor)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export default function Configuracoes() {
  const [form, setForm] = useState(FORM_VAZIO)
  const [configId, setConfigId] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [buscandoCnpj, setBuscandoCnpj] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }

  useEffect(() => {
    carregarConfig()
  }, [])

  async function carregarConfig() {
    setCarregando(true)
    try {
      const res = await fetch('/api/parametrizacao/primeira')
      if (res.ok) {
        const data = await res.json()
        setConfigId(data.id)
        setForm({
          razaoSocial: data.razaoSocial || '',
          nomeFantasia: data.nomeFantasia || '',
          cnpj: data.cnpj || '',
          telefone: data.telefone || '',
          email: data.email || '',
          site: data.site || '',
          dataFundacao: data.dataFundacao || '',
          logoUrl: data.logoUrl || '',
          observacoes: data.observacoes || '',
          enderecoCep: data.endereco?.cep || '',
          enderecoLogradouro: data.endereco?.logradouro || '',
          enderecoNumero: data.endereco?.numero || '',
          enderecoComplemento: data.endereco?.complemento || '',
          enderecoBairro: data.endereco?.bairro || '',
          enderecoCidade: data.endereco?.cidade || '',
          enderecoEstado: data.endereco?.estado || '',
        })
      }
    } catch {
      mostrarToast('Erro ao carregar configurações. Verifique se o servidor está rodando.', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  async function buscarDadosPorCnpj(cnpj: string) {
    if (cnpj.length !== 14) return
    setBuscandoCnpj(true)
    try {
      const res = await fetch(`/api/consulta-cnpj/${cnpj}`)
      if (!res.ok) {
        mostrarToast('Erro ao consultar CNPJ. Tente novamente.', 'erro')
        return
      }
      const data = await res.json()
      if (data.valido) {
        const updates: Record<string, string> = {}
        if (data.razaoSocial) updates.razaoSocial = data.razaoSocial
        if (data.nomeFantasia) updates.nomeFantasia = data.nomeFantasia
        if (data.logradouro) updates.enderecoLogradouro = data.logradouro
        if (data.numero) updates.enderecoNumero = data.numero
        if (data.complemento) updates.enderecoComplemento = data.complemento
        if (data.bairro) updates.enderecoBairro = data.bairro
        if (data.municipio) updates.enderecoCidade = data.municipio
        if (data.uf) updates.enderecoEstado = data.uf
        if (data.cep) updates.enderecoCep = data.cep
        if (data.telefone) updates.telefone = data.telefone
        if (data.email) updates.email = data.email
        setForm(f => ({ ...f, ...updates }))
        mostrarToast('Dados encontrados para o CNPJ informado!', 'sucesso')
      } else {
        mostrarToast(data.mensagem || 'CNPJ inválido. Verifique os dígitos e tente novamente.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CNPJ. Verifique se o servidor está rodando.', 'erro')
    } finally {
      setBuscandoCnpj(false)
    }
  }

  async function buscarDadosPorCep(cep: string) {
    if (cep.length !== 8) return
    setBuscandoCep(true)
    try {
      const res = await fetch(`/api/consulta-cep/${cep}`)
      if (!res.ok) {
        mostrarToast('Erro ao consultar CEP. Tente novamente.', 'erro')
        return
      }
      const data = await res.json()
      if (data.valido) {
        setForm(f => ({
          ...f,
          enderecoLogradouro: data.logradouro || f.enderecoLogradouro,
          enderecoComplemento: data.complemento || f.enderecoComplemento,
          enderecoBairro: data.bairro || f.enderecoBairro,
          enderecoCidade: data.localidade || f.enderecoCidade,
          enderecoEstado: data.uf || f.enderecoEstado,
        }))
        mostrarToast('CEP encontrado!', 'sucesso')
      } else {
        mostrarToast(data.mensagem || 'CEP não encontrado.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CEP. Verifique se o servidor está rodando.', 'erro')
    } finally {
      setBuscandoCep(false)
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.razaoSocial || !limparCnpj(form.cnpj)) {
      mostrarToast('Razão Social e CNPJ são obrigatórios.', 'erro')
      return
    }
    if (limparCnpj(form.cnpj).length !== 14) {
      mostrarToast('CNPJ deve ter 14 dígitos.', 'erro')
      return
    }
    setSalvando(true)
    const body = {
      razaoSocial: form.razaoSocial,
      nomeFantasia: form.nomeFantasia || null,
      cnpj: limparCnpj(form.cnpj),
      telefone: form.telefone || null,
      email: form.email || null,
      site: form.site || null,
      logoUrl: form.logoUrl || null,
      dataFundacao: form.dataFundacao || null,
      observacoes: form.observacoes || null,
      endereco: {
        cep: form.enderecoCep || null,
        logradouro: form.enderecoLogradouro || null,
        numero: form.enderecoNumero || null,
        complemento: form.enderecoComplemento || null,
        bairro: form.enderecoBairro || null,
        cidade: form.enderecoCidade || null,
        estado: form.enderecoEstado || null,
      },
    }
    try {
      const url = configId ? `/api/parametrizacao/${configId}` : '/api/parametrizacao'
      const method = configId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.error || 'Erro ao salvar')
      }
      const saved = await res.json()
      if (!configId) setConfigId(saved.id)
      mostrarToast('Configurações salvas com sucesso!', 'sucesso')
    } catch (err: any) {
      mostrarToast(err.message || 'Erro ao salvar configurações. Verifique os dados e tente novamente.', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Configurações" subtitle="Associação do Câncer - Gestão Integrada" />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {carregando ? (
            <div className="flex items-center justify-center h-full">
              <Loader className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Configurações do Sistema</h3>
                {configId && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    ID: {configId}
                  </span>
                )}
              </div>

              <form onSubmit={salvar} className="space-y-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                    Dados da Organização
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Razão Social <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Razão social da organização"
                        value={form.razaoSocial}
                        onChange={e => setForm(f => ({ ...f, razaoSocial: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
                      <input
                        type="text"
                        placeholder="Nome fantasia"
                        value={form.nomeFantasia}
                        onChange={e => setForm(f => ({ ...f, nomeFantasia: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNPJ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="00.000.000/0000-00"
                          value={formatarCnpj(form.cnpj)}
                          onChange={e => setForm(f => ({ ...f, cnpj: limparCnpj(e.target.value) }))}
                          onBlur={() => buscarDadosPorCnpj(limparCnpj(form.cnpj))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {buscandoCnpj ? (
                            <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <input
                        type="text"
                        placeholder="(11) 99999-9999"
                        value={form.telefone}
                        onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                      <input
                        type="email"
                        placeholder="contato@ong.com.br"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                      <input
                        type="url"
                        placeholder="https://"
                        value={form.site}
                        onChange={e => setForm(f => ({ ...f, site: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fundação</label>
                      <input
                        type="date"
                        value={form.dataFundacao}
                        onChange={e => setForm(f => ({ ...f, dataFundacao: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL da Logo</label>
                      <input
                        type="text"
                        placeholder="https://"
                        value={form.logoUrl}
                        onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                    Endereço
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="00000-000"
                          value={formatarCep(form.enderecoCep)}
                          onChange={e => setForm(f => ({ ...f, enderecoCep: limparCep(e.target.value) }))}
                          onBlur={() => buscarDadosPorCep(limparCep(form.enderecoCep))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {buscandoCep ? (
                            <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                      <input
                        type="text"
                        placeholder="Rua, Avenida..."
                        value={form.enderecoLogradouro}
                        onChange={e => setForm(f => ({ ...f, enderecoLogradouro: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={form.enderecoNumero}
                        onChange={e => setForm(f => ({ ...f, enderecoNumero: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
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
                        placeholder="Centro"
                        value={form.enderecoBairro}
                        onChange={e => setForm(f => ({ ...f, enderecoBairro: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                        <input
                          type="text"
                          placeholder="São Paulo"
                          value={form.enderecoCidade}
                          onChange={e => setForm(f => ({ ...f, enderecoCidade: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <select
                          value={form.enderecoEstado}
                          onChange={e => setForm(f => ({ ...f, enderecoEstado: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
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

                <div>
                  <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                    Observações
                  </h4>
                  <textarea
                    rows={4}
                    placeholder="Informações adicionais sobre a organização..."
                    value={form.observacoes}
                    onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => carregarConfig()}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Descartar Alterações
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="px-6 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {salvando && <Loader className="w-4 h-4 animate-spin" />}
                    {salvando ? 'Salvando...' : 'Salvar Configurações'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </div>
  )
}
