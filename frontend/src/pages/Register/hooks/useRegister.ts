import { useState } from 'react'
import axios from 'axios'
import { validarCpf, limparCpf } from '../../../utils/cpf'
import { validarEmail, limparTelefone } from '../../../utils/validators'

export function useRegister() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (!nome.trim()) { setErro('Nome é obrigatório'); return }
    if (!email.trim()) { setErro('Email é obrigatório'); return }
    if (!validarEmail(email)) { setErro('Email inválido'); return }
    if (limparCpf(cpf).length !== 11) { setErro('CPF deve ter 11 dígitos'); return }
    if (!validarCpf(cpf)) { setErro('CPF inválido. Verifique os dígitos.'); return }
    if (senha.length < 6) { setErro('Senha deve ter no mínimo 6 caracteres'); return }

    setLoading(true)
    try {
      const res = await axios.post('/auth/register', {
        nome: nome.trim(),
        email: email.trim(),
        cpf: limparCpf(cpf),
        senha,
        dataNascimento,
        telefone: limparTelefone(telefone),
      })
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      window.location.href = '/configuracoes'
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao cadastrar'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    nome, setNome,
    email, setEmail,
    cpf, setCpf,
    senha, setSenha,
    dataNascimento, setDataNascimento,
    telefone, setTelefone,
    erro, loading,
    handleRegister,
  }
}
