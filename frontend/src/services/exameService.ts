import api from './api'
import type { Exame, TipoExame, Medico, Prontuario } from '../types'

interface SalvarExamePayload {
  prontuario: { id: number }
  medico: { id: number }
  tipoExame: { id: number }
  justificativaClinica: string
  status: string
  observacoesMedico: string | null
  dataRealizacao: string | null
}

export async function listarExames(status?: string, tipoExameNome?: string): Promise<Exame[]> {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (tipoExameNome) params.append('tipoExameNome', tipoExameNome)
  const query = params.toString()
  const res = await api.get(`/api/exames${query ? `?${query}` : ''}`)
  return res.data
}

export async function listarTiposExame(): Promise<TipoExame[]> {
  const res = await api.get('/api/tipos-exame')
  return res.data
}

export async function criarTipoExame(nome: string, descricao: string | null): Promise<TipoExame> {
  const res = await api.post('/api/tipos-exame', { nome, descricao })
  return res.data
}

export async function excluirTipoExame(id: number): Promise<void> {
  await api.delete(`/api/tipos-exame/${id}`)
}

export async function listarMedicosExame(): Promise<Medico[]> {
  const res = await api.get('/api/exames/medicos')
  return res.data
}

export async function buscarProntuariosExame(termo: string): Promise<Prontuario[]> {
  const res = await api.get(`/api/exames/prontuarios?q=${encodeURIComponent(termo)}`)
  return res.data
}

export async function salvarExame(id: string | undefined, body: SalvarExamePayload): Promise<Exame> {
  const url = id ? `/api/exames/${id}` : '/api/exames'
  const method = id ? 'PUT' : 'POST'
  const res = await api({ url, method, data: body })
  return res.data
}

export async function excluirExame(id: number): Promise<void> {
  await api.delete(`/api/exames/${id}`)
}
