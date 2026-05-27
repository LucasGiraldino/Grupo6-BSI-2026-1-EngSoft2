export type Medico = {
  id: number
  crm: string
  especialidadeMedica: string
  usuario?: { id?: number; nome: string }
}
