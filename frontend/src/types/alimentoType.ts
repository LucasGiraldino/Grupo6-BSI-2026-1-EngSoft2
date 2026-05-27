import { Categoria } from "./categoriaType"

export type Alimento = {
  id: number
  nome: string
  descricao?: string
  categoria?: Categoria
  unidadeMedida: string
  dataVencimento?: string
}
