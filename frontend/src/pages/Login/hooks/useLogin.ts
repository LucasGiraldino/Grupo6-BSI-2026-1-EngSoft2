import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export function useLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      if (email && senha) {
        const res = await axios.post('/auth/login', { email, senha })
        if (res.data.totpRequired) {
          navigate('/verificar', { state: { email, senha }, replace: true })
        } else if (res.data.accessToken) {
          localStorage.setItem('token', res.data.accessToken)
          if (res.data.refreshToken) {
            localStorage.setItem('refreshToken', res.data.refreshToken)
          }
          window.location.href = '/dashboard'
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Erro ao fazer login'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    setEmail,
    senha,
    setSenha,
    erro,
    loading,
    handleLogin,
  }
}
