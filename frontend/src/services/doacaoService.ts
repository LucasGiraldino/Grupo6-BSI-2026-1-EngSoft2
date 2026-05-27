import api from './api'
import type { Doacao, Paciente, EstoqueItem } from '../types'

interface CriarDoacaoPayload {
  idPaciente: number
  idProfissional: number
  observacoes: string
  itens: { idAlimento: number; quantidade: number }[]
}

export async function listarDoacoes(nomePaciente?: string, dataInicio?: string, dataFim?: string): Promise<Doacao[]> {
  const params = new URLSearchParams()
  if (nomePaciente) params.append('nomePaciente', nomePaciente)
  if (dataInicio) params.append('dataInicio', dataInicio)
  if (dataFim) params.append('dataFim', dataFim)
  const query = params.toString()
  const res = await api.get(`/api/doacoes${query ? `?${query}` : ''}`)
  return res.data
}

export async function criarDoacao(body: CriarDoacaoPayload): Promise<Doacao> {
  const res = await api.post('/api/doacoes', body)
  return res.data
}

export async function atualizarDoacao(id: number, body: CriarDoacaoPayload): Promise<Doacao> {
  const res = await api.put(`/api/doacoes/${id}`, body)
  return res.data
}

export async function excluirDoacao(id: number): Promise<void> {
  await api.delete(`/api/doacoes/${id}`)
}

export async function listarPacientesDoacao(): Promise<Paciente[]> {
  const res = await api.get('/api/pacientes')
  return res.data
}

export async function listarEstoque(): Promise<EstoqueItem[]> {
  const res = await api.get('/api/estoque')
  return res.data
}
