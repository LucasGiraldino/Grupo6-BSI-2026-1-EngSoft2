import { Medico } from "./medicoType"

export type TipoExame = {
  id: number
  nome: string
  descricao?: string
  ativo: boolean
}

export type Exame = {
  id: number
  tipoExame: TipoExame
  medico: Medico
  prontuario: { id: number; paciente?: { id?: number; nome: string; cpf?: string }; dataAbertura?: string }
  justificativaClinica: string
  dataSolicitacao: string
  status: string
  observacoesMedico?: string
  dataRealizacao?: string
}
