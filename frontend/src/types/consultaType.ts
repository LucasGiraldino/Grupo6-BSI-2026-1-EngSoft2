export const TIPOS_CONSULTA = ['CONSULTA', 'URGENCIA', 'RETORNO'] as const
export type TipoConsulta = typeof TIPOS_CONSULTA[number]

export const STATUS_CONSULTA = ['AGENDADA', 'CONCLUIDA', 'CANCELADA'] as const
export type StatusConsulta = typeof STATUS_CONSULTA[number]

export const STATUS_LABELS: Record<string, string> = {
  AGENDADA: 'Agendada',
  CONCLUIDA: 'Concluída',
  CANCELADA: 'Cancelada',
  ESPERANDO: 'Esperando',
}

export type TriagemResumo = {
  id: number
  pressaoArterial?: string
  febre?: number
  condicaoClinica: string
  condicaoNutricional?: string
  condicaoSocial?: string
  observacoes?: string
  dataTriagem: string
  medico?: { usuario?: { nome: string }; crm?: string }
}

export type Consulta = {
  id: number
  paciente: { id: number; nome: string; cpf: string }
  profissional?: { id: number; usuario: { nome: string }; especialidade: string }
  agenda?: {
    id: number
    data: string
    horaInicio: string
    horaFim: string
  }
  tipoConsulta: TipoConsulta
  status: string
  observacoes?: string
  dataAgendamento: string
  triagem?: TriagemResumo
}
