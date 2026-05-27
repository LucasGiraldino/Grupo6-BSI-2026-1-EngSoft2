import api from './api'
import type { Receita, Prontuario, Medico } from '../types'

interface SalvarReceitaPayload {
  dataEmissao: string | null
  descricao: string | null
  dataValidade: string | null
  prontuario: { id: number }
  medico: { id: number }
}

export async function listarReceitas(): Promise<Receita[]> {
  const res = await api.get('/api/receitas')
  return res.data
}

export async function listarProntuarios(): Promise<Prontuario[]> {
  const res = await api.get('/api/prontuarios')
  return res.data
}

export async function listarMedicos(): Promise<Medico[]> {
  const res = await api.get('/api/triagens/medicos')
  return res.data
}

export async function salvarReceita(id: string | undefined, body: SalvarReceitaPayload): Promise<Receita> {
  const url = id ? `/api/receitas/${id}` : '/api/receitas'
  const method = id ? 'PUT' : 'POST'
  const res = await api({ url, method, data: body })
  return res.data
}

export async function excluirReceita(id: number): Promise<void> {
  await api.delete(`/api/receitas/${id}`)
}
