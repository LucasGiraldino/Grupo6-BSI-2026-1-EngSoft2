import api from './api'
import type { Prontuario } from '../types'

interface AtualizarProntuarioPayload {
  observacoesGerais: string | null
  dataFechamento: string | null
  paciente: { id: number }
}

export async function listarProntuarios(q?: string): Promise<Prontuario[]> {
  const params = q ? `?q=${encodeURIComponent(q)}` : ''
  const res = await api.get(`/api/prontuarios${params}`)
  return res.data
}

export async function atualizarProntuario(id: number, body: AtualizarProntuarioPayload): Promise<Prontuario> {
  const res = await api.put(`/api/prontuarios/${id}`, body)
  return res.data
}
