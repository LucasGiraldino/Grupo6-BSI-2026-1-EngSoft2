import axios from 'axios'

interface LoginResponse {
  totpRequired?: boolean
  accessToken?: string
  refreshToken?: string
}

interface RegisterResponse {
  accessToken: string
  refreshToken: string
}

interface Setup2FAResponse {
  secret: string
  provisioningUri: string
}

interface MessageResponse {
  message: string
}

interface ForgotPasswordResponse {
  codigo: string
}

export async function login(email: string, senha: string): Promise<LoginResponse> {
  const res = await axios.post('/auth/login', { email, senha })
  return res.data
}

export async function register(dados: {
  nome: string
  email: string
  cpf: string
  senha: string
  dataNascimento: string
  telefone: string
}): Promise<RegisterResponse> {
  const res = await axios.post('/auth/register', dados)
  return res.data
}

export async function verifyOTP(email: string, codigo: string): Promise<RegisterResponse> {
  const res = await axios.post('/auth/verify', { email, codigo })
  return res.data
}

export async function setup2FA(email: string, senha: string): Promise<Setup2FAResponse> {
  const res = await axios.post('/auth/2fa/setup', { email, senha })
  return res.data
}

export async function verifySetup2FA(email: string, senha: string, codigo: string): Promise<MessageResponse> {
  const res = await axios.post('/auth/2fa/verify-setup', { email, senha, codigo })
  return res.data
}

export async function disable2FA(email: string, senha: string): Promise<MessageResponse> {
  const res = await axios.post('/auth/2fa/disable', { email, senha })
  return res.data
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  const res = await axios.post('/auth/forgot-password', { email })
  return res.data
}

export async function resetPassword(email: string, codigo: string, novaSenha: string): Promise<void> {
  await axios.post('/auth/reset-password', { email, codigo, novaSenha })
}
