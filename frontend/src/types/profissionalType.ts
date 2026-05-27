import { Endereco } from "./enderecoType"

export type Profissional = {
  id: number
  usuario: { id: number; nome: string; email?: string; cpf?: string }
  endereco?: Endereco
  especialidade: string
  registroProfissional: string
  dataAdmissao: string
  dataDemissao?: string
}
