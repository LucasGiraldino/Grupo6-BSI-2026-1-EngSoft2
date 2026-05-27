import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

type Etapa = 'email' | 'codigo'

export function useEsqueciSenha() {
  const navigate = useNavigate()

  const [etapa, setEtapa] = useState<Etapa>('email')
  const [email, setEmail] = useState('')
  const [emailEnviado, setEmailEnviado] = useState('')
  const [codigoRevelado, setCodigoRevelado] = useState('')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSolicitarCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await axios.post('/auth/forgot-password', { email })
      setEmailEnviado(email)
      setCodigoRevelado(res.data.codigo || '')
      setEtapa('codigo')
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao solicitar código')
    } finally {
      setLoading(false)
    }
  }

  const handleResetarSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    if (novaSenha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não conferem')
      return
    }

    setLoading(true)
    try {
      await axios.post('/auth/reset-password', {
        email: emailEnviado,
        codigo: codigo || codigoRevelado,
        novaSenha,
      })
      setSucesso('Senha redefinida com sucesso!')
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  return {
    etapa, email, setEmail,
    emailEnviado, codigoRevelado,
    codigo, setCodigo,
    novaSenha, setNovaSenha,
    confirmarSenha, setConfirmarSenha,
    erro, sucesso, loading,
    handleSolicitarCodigo,
    handleResetarSenha,
    navigate,
  }
}
