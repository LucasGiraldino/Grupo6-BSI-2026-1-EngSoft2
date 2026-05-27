import api from './api'
import type { Profissional, AgendaSlot, AgendaDisponivel } from '../types'

export async function listarProfissionaisAgenda(): Promise<Pick<Profissional, 'id' | 'especialidade' | 'usuario'>[]> {
  const res = await api.get('/api/profissionais')
  return res.data
}

export async function listarSlots(profissionalId: string): Promise<AgendaSlot[]> {
  const res = await api.get(`/api/agenda/profissional/${profissionalId}`)
  return res.data
}

export async function criarSlot(body: {
  usuario: { id: number }
  data: string
  horaInicio: string
  horaFim: string
  disponivel: boolean
}): Promise<AgendaSlot> {
  const res = await api.post('/api/agenda', body)
  return res.data
}

export async function excluirSlot(id: number): Promise<void> {
  await api.delete(`/api/agenda/${id}`)
}

export async function listarSlotsMes(params: { idProfissional: string; ano: number; mes: number }): Promise<AgendaDisponivel[]> {
  const res = await api.get('/api/agenda/disponivel/mes', { params })
  return res.data
}
