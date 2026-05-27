import api from './api'
import type { Triagem, Medico, Prontuario } from '../types'

interface SalvarTriagemPayload {
  prontuario: { id: number }
  medico: { id: number }
  condicaoClinica: string
  pressaoArterial: string | null
  febre: number | null
  condicaoNutricional: string | null
  condicaoSocial: string | null
  observacoes: string | null
}

export async function listarTriagens(pacienteNome?: string, medicoId?: string): Promise<Triagem[]> {
  const params = new URLSearchParams()
  if (pacienteNome) params.append('pacienteNome', pacienteNome)
  if (medicoId) params.append('medicoId', medicoId)
  const query = params.toString()
  const res = await api.get(`/api/triagens${query ? `?${query}` : ''}`)
  return res.data
}

export async function listarMedicos(): Promise<Medico[]> {
  const res = await api.get('/api/triagens/medicos')
  return res.data
}

export async function buscarProntuarios(termo: string): Promise<Prontuario[]> {
  const res = await api.get(`/api/triagens/prontuarios?q=${encodeURIComponent(termo)}`)
  return res.data
}

export async function salvarTriagem(id: string | undefined, body: SalvarTriagemPayload): Promise<void> {
  const url = id ? `/api/triagens/${id}` : '/api/triagens'
  const method = id ? 'PUT' : 'POST'
  await api({ url, method, data: body })
}

export async function excluirTriagem(id: number): Promise<void> {
  await api.delete(`/api/triagens/${id}`)
}
