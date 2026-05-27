import { Endereco } from "./enderecoType"

export type Paciente = {
  id: number
  nome: string
  cpf: string
  dataNascimento: string
  sexo: string
  telefone?: string
  email?: string
  restricoesAlimentares?: string
  dataCadastro: string
  endereco?: Endereco
}
