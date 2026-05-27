export type AgendaSlot = {
  id: number
  usuario: { id: number }
  data: string
  horaInicio: string
  horaFim: string
  disponivel: boolean
}

export type AgendaDisponivel = {
  id: number
  data: string
  horaInicio: string
  horaFim: string
}
