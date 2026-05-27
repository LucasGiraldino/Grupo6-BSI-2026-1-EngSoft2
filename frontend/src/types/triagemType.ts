import { Medico } from "./medicoType"
import { Prontuario } from "./prontuarioType"

export type Triagem = {
  id: number
  medico: Medico
  prontuario: Prontuario
  dataTriagem: string
  pressaoArterial?: string
  febre?: number
  condicaoClinica: string
  condicaoNutricional?: string
  condicaoSocial?: string
  observacoes?: string
}
