import { Alimento } from "./alimentoType"

export type ItemCompra = {
  alimento: Alimento
  quantidade: number
  preco: number
}

export type Compra = {
  id: number
  dataCompra: string
  observacoes?: string
  itens: ItemCompra[]
}
