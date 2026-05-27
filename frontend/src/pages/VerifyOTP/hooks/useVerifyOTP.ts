import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

export function useVerifyOTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as any)?.email || ''

  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true })
    }
  }, [email, navigate])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await axios.post('/auth/verify', { email, codigo })
      const accessToken = res.data?.accessToken
      const refreshToken = res.data?.refreshToken
      if (!accessToken) {
        setErro('Resposta inválida do servidor.')
        return
      }
      localStorage.setItem('token', accessToken)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      window.location.href = '/pacientes'
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Código inválido ou expirado'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  return {
    email,
    codigo, setCodigo,
    erro, loading,
    handleVerify,
    navigate,
  }
}
