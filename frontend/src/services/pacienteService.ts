import api from './api'
import type { Paciente } from '../types'

interface CriarPacientePayload {
  nome: string
  cpf: string
  dataNascimento: string
  sexo: string
  telefone: string | null
  email: string | null
  restricoesAlimentares: string | null
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento: string | null
    bairro: string
    cidade: string
    estado: string
    pais: string
  }
}

export async function listarPacientes(nome?: string, cpf?: string): Promise<Paciente[]> {
  const params = new URLSearchParams()
  if (nome) params.append('nome', nome)
  if (cpf) params.append('cpf', cpf)
  const query = params.toString()
  const res = await api.get(`/api/pacientes${query ? `?${query}` : ''}`)
  return res.data
}

export async function criarPaciente(body: CriarPacientePayload): Promise<Paciente> {
  const res = await api.post('/api/pacientes', body)
  return res.data
}

export async function atualizarPaciente(id: number, body: CriarPacientePayload): Promise<Paciente> {
  const res = await api.put(`/api/pacientes/${id}`, body)
  return res.data
}

export async function excluirPaciente(id: number): Promise<void> {
  await api.delete(`/api/pacientes/${id}`)
}

export async function consultarCpf(cpf: string, signal?: AbortSignal): Promise<{ valido: boolean; nome?: string; dataNascimento?: string; sexo?: string; mensagem?: string }> {
  const res = await api.get(`/api/consulta-cpf/${cpf}`, { signal })
  return res.data
}

export async function consultarCep(cep: string, signal?: AbortSignal): Promise<{
  valido: boolean
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  cep?: string
  mensagem?: string
}> {
  const res = await api.get(`/api/consulta-cep/${cep}`, { signal })
  return res.data
}
