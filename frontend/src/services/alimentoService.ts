import api from './api'
import type { Alimento, Categoria } from '../types'

interface SalvarAlimentoPayload {
  nome: string
  descricao: string
  unidadeMedida: string
  dataVencimento: string | null
  categoria: { id: number }
}

export async function listarAlimentos(nome?: string, categoriaId?: string): Promise<Alimento[]> {
  const params = new URLSearchParams()
  if (nome) params.append('nome', nome)
  if (categoriaId) params.append('categoriaId', categoriaId)
  const query = params.toString()
  const res = await api.get(`/api/alimentos${query ? `?${query}` : ''}`)
  return res.data
}

export async function salvarAlimento(id: string | undefined, body: SalvarAlimentoPayload): Promise<Alimento> {
  const url = id ? `/api/alimentos/${id}` : '/api/alimentos'
  const method = id ? 'PUT' : 'POST'
  const res = await api({ url, method, data: body })
  return res.data
}

export async function excluirAlimento(id: number): Promise<void> {
  await api.delete(`/api/alimentos/${id}`)
}

export async function listarCategorias(): Promise<Categoria[]> {
  const res = await api.get('/api/alimentos/categorias')
  return res.data
}

export async function criarCategoria(nome: string): Promise<Categoria> {
  const res = await api.post('/api/alimentos/categorias', { nome })
  return res.data
}

export async function excluirCategoria(id: number): Promise<void> {
  await api.delete(`/api/alimentos/categorias/${id}`)
}
