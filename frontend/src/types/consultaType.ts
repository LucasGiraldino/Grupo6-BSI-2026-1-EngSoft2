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
  tipoConsulta: string
  status: string
  observacoes?: string
  dataAgendamento: string
  triagem?: TriagemResumo
}
