import api from './api'
import type { Profissional, Usuario } from '../types'

interface CriarProfissionalPayload {
  usuario: { id: number }
  especialidade: string
  registroProfissional: string
  dataAdmissao: string
  ehMedico: boolean
}

export async function listarProfissionais(nome?: string, especialidade?: string): Promise<Profissional[]> {
  const params = new URLSearchParams()
  if (nome) params.append('nome', nome)
  if (especialidade) params.append('especialidade', especialidade)
  const query = params.toString()
  const res = await api.get(`/api/profissionais${query ? `?${query}` : ''}`)
  return res.data
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const res = await api.get('/apis/user')
  return res.data
}

export async function criarProfissional(body: CriarProfissionalPayload): Promise<Profissional> {
  const res = await api.post('/api/profissionais', body)
  return res.data
}

export async function atualizarProfissional(id: number, body: CriarProfissionalPayload): Promise<Profissional> {
  const res = await api.put(`/api/profissionais/${id}`, body)
  return res.data
}

export async function desativarProfissional(id: number): Promise<void> {
  await api.delete(`/api/profissionais/${id}`)
}
