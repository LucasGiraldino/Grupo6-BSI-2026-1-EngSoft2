import { Endereco } from "./enderecoType"

export type Usuario = {
  id: number
  nome: string
  email: string
  cpf: string
  perfil: string
  ativo: boolean
  dataCadastro: string
  dataNascimento?: string
  telefone?: string
  endereco?: Endereco
}
