export function validarCpf(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return false
  if (digits.split('').every(c => c === digits[0])) return false

  let soma = 0
  for (let i = 0; i < 9; i++) soma += parseInt(digits[i]) * (10 - i)
  let dig1 = 11 - (soma % 11)
  if (dig1 > 9) dig1 = 0
  if (dig1 !== parseInt(digits[9])) return false

  soma = 0
  for (let i = 0; i < 10; i++) soma += parseInt(digits[i]) * (11 - i)
  let dig2 = 11 - (soma % 11)
  if (dig2 > 9) dig2 = 0
  return dig2 === parseInt(digits[10])
}

export function limparCpf(valor: string): string {
  return valor.replace(/\D/g, '').slice(0, 11)
}

export function formatarCpf(valor: string): string {
  const digits = limparCpf(valor)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}
