import api from './api'
import type { Usuario } from '../types'

interface CriarUsuarioPayload {
  nome: string
  email: string
  cpf: string
  perfil: string
  dataNascimento: string
  telefone: string
  enderecoCep: string
  enderecoLogradouro: string
  enderecoNumero: string
  enderecoComplemento: string
  enderecoBairro: string
  enderecoCidade: string
  enderecoEstado: string
  enderecoPais: string
  senha?: string
}

export async function listarUsuarios(search?: string, perfil?: string): Promise<Usuario[]> {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (perfil) params.append('perfil', perfil)
  const query = params.toString()
  const res = await api.get(`/apis/user${query ? `?${query}` : ''}`)
  return res.data
}

export async function criarUsuario(payload: CriarUsuarioPayload): Promise<Usuario> {
  const res = await api.post('/apis/user', payload)
  return res.data
}

export async function atualizarUsuario(id: number, payload: CriarUsuarioPayload): Promise<Usuario> {
  const res = await api.put(`/apis/user/${id}`, payload)
  return res.data
}

export async function desativarUsuario(id: number): Promise<void> {
  await api.delete(`/apis/user/${id}`)
}

export async function consultarCepUsuario(cep: string, signal?: AbortSignal): Promise<{
  valido: boolean
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
  mensagem?: string
}> {
  const res = await api.get(`/api/consulta-cep/${cep}`, { signal })
  return res.data
}
