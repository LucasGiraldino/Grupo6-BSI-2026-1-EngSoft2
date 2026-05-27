import api from './api'
import type { Compra, Alimento } from '../types'

interface SalvarCompraPayload {
  dataCompra: string | null
  observacoes: string | null
  itens: { alimento: { id: number }; quantidade: number; preco: number }[]
}

export async function listarCompras(dataInicio?: string, dataFim?: string, observacoes?: string): Promise<Compra[]> {
  const params = new URLSearchParams()
  if (dataInicio) params.append('dataInicio', dataInicio)
  if (dataFim) params.append('dataFim', dataFim)
  if (observacoes) params.append('observacoes', observacoes)
  const query = params.toString()
  const res = await api.get(`/api/compras${query ? `?${query}` : ''}`)
  return res.data
}

export async function listarAlimentosCompra(): Promise<Alimento[]> {
  const res = await api.get('/api/alimentos')
  return res.data
}

export async function salvarCompra(id: string | undefined, body: SalvarCompraPayload): Promise<Compra> {
  const url = id ? `/api/compras/${id}` : '/api/compras'
  const method = id ? 'PUT' : 'POST'
  const res = await api({ url, method, data: body })
  return res.data
}

export async function excluirCompra(id: number): Promise<void> {
  await api.delete(`/api/compras/${id}`)
}
