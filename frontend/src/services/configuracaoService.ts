import api from './api'

interface Configuracao {
  id: number | null
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  telefone: string
  email: string
  site: string
  dataFundacao: string
  logoUrl: string
  observacoes: string
  endereco?: {
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
}

interface SalvarConfiguracaoPayload {
  razaoSocial: string
  nomeFantasia: string | null
  cnpj: string
  telefone: string | null
  email: string | null
  site: string | null
  logoUrl: string | null
  dataFundacao: string | null
  observacoes: string | null
  endereco: {
    cep: string | null
    logradouro: string | null
    numero: string | null
    complemento: string | null
    bairro: string | null
    cidade: string | null
    estado: string | null
  }
}

interface ConsultaCnpjResponse {
  valido: boolean
  razaoSocial?: string
  nomeFantasia?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  uf?: string
  cep?: string
  telefone?: string
  email?: string
  mensagem?: string
}

interface ConsultaCepResponse {
  valido: boolean
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  mensagem?: string
}

export async function carregarConfiguracao(): Promise<Configuracao> {
  const res = await api.get('/api/parametrizacao/primeira')
  return res.data
}

export async function salvarConfiguracao(id: number | null, body: SalvarConfiguracaoPayload): Promise<Configuracao> {
  const res = id
    ? await api.put(`/api/parametrizacao/${id}`, body)
    : await api.post('/api/parametrizacao', body)
  return res.data
}

export async function consultarCnpj(cnpj: string): Promise<ConsultaCnpjResponse> {
  const res = await api.get(`/api/consulta-cnpj/${cnpj}`)
  return res.data
}

export async function consultarCepConfig(cep: string): Promise<ConsultaCepResponse> {
  const res = await api.get(`/api/consulta-cep/${cep}`)
  return res.data
}
