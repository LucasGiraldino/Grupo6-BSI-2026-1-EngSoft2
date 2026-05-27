import api from './api'
import type { Profissional, Paciente, Consulta, AgendaDisponivel } from '../types'

interface CriarConsultaPayload {
  paciente: { id: number }
  profissional: { id: number }
  agenda: { id: number }
  tipoConsulta: string
  observacoes: string | null
  status: string
  dataAgendamento: string
}

interface AtualizarConsultaPayloadAgenda {
  profissional: { id: number }
  agenda: { id: number }
  status: string
}

interface AtualizarConsultaPayloadDados {
  paciente: { id: number }
  tipoConsulta: string
  observacoes: string | null
  status: string
}

export async function listarProfissionais(): Promise<Profissional[]> {
  const res = await api.get('/api/profissionais')
  return res.data
}

export async function listarPacientes(): Promise<Paciente[]> {
  const res = await api.get('/api/pacientes')
  return res.data
}

export async function listarConsultas(params?: { status?: string }): Promise<Consulta[]> {
  const res = await api.get('/api/consultas', { params })
  return res.data
}

export async function listarAgendaMes(idProfissional: string, ano: number, mes: number): Promise<AgendaDisponivel[]> {
  const res = await api.get('/api/agenda/disponivel/mes', { params: { idProfissional, ano, mes } })
  return res.data
}

export async function listarConsultasAgenda(params: { profissional: string; dataInicio: string; dataFim: string }): Promise<Consulta[]> {
  const res = await api.get('/api/consultas/agenda', { params })
  return res.data
}

export async function criarConsulta(body: CriarConsultaPayload): Promise<Consulta> {
  const res = await api.post('/api/consultas', body)
  return res.data
}

export async function atualizarConsulta(id: number, body: AtualizarConsultaPayloadAgenda | AtualizarConsultaPayloadDados): Promise<Consulta> {
  const res = await api.put(`/api/consultas/${id}`, body)
  return res.data
}

export async function cancelarConsulta(id: number): Promise<void> {
  await api.delete(`/api/consultas/${id}`)
}
