import { Alimento } from "./alimentoType"

export type EstoqueItem = {
  id: number
  alimento: Alimento
  quantidadeAtual: number
}

export type ItemDoacao = {
  id: number
  alimento: Alimento
  quantidade: number
  peso: number | null
}

export type Doacao = {
  id: number
  paciente: { id: number; nome: string; cpf: string }
  profissional: { id: number; usuario: { id: number; nome: string } }
  dataDoacao: string
  observacoes?: string
  itens: ItemDoacao[]
}

export type TabelaItem = {
  idAlimento: number
  nomeAlimento: string
  quantidade: number
  unidadeMedida: string
}
