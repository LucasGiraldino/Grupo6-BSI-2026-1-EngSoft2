// ─── TELEFONE ───────────────────────────────────────

export function limparTelefone(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, 11)
}

export function formatarTelefone(valor: string): string {
  const digits = limparTelefone(valor)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function validarTelefone(valor: string): boolean {
  const digits = limparTelefone(valor)
  return digits.length === 10 || digits.length === 11
}

// ─── CEP ────────────────────────────────────────────

export function limparCep(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, 8)
}

export function formatarCep(valor: string): string {
  const digits = limparCep(valor)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export function validarCep(valor: string): boolean {
  const digits = limparCep(valor)
  return digits.length === 8
}

// ─── CNPJ ────────────────────────────────────────────

export function limparCnpj(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, 14)
}

export function formatarCnpj(valor: string): string {
  const digits = limparCnpj(valor)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`
}

export function validarCnpj(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) return false
  if (digits.split('').every(c => c === digits[0])) return false

  let soma = 0
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  for (let i = 0; i < 12; i++) soma += parseInt(digits[i]) * pesos1[i]
  let dig1 = 11 - (soma % 11)
  if (dig1 > 9) dig1 = 0
  if (dig1 !== parseInt(digits[12])) return false

  soma = 0
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  for (let i = 0; i < 13; i++) soma += parseInt(digits[i]) * pesos2[i]
  let dig2 = 11 - (soma % 11)
  if (dig2 > 9) dig2 = 0
  return dig2 === parseInt(digits[13])
}

// ─── EMAIL ────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function limparMoeda(valor: string): number {
  const digits = valor.replace(/\D/g, '')
  return parseFloat(digits) / 100
}
