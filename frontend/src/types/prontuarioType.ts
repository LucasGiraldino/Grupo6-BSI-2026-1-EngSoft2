export type Prontuario = {
  id: number
  paciente: { id: number; nome: string; cpf: string }
  dataAbertura: string
  dataFechamento: string | null
  observacoesGerais: string | null
}
