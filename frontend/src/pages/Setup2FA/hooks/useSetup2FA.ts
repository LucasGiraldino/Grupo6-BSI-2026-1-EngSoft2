import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import axios from 'axios'
import QRCode from 'qrcode'

type Step = 'password' | 'qr' | 'verify' | 'done'

export function useSetup2FA() {
  const navigate = useNavigate()
  const { email } = useAuth()

  const [senha, setSenha] = useState('')
  const [step, setStep] = useState<Step>('password')
  const [secret, setSecret] = useState('')
  const [, setProvisioningUri] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    if (!email) {
      navigate('/login', { replace: true })
    }
  }, [email, navigate])

  const handlePasswordSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await axios.post('/auth/2fa/setup', { email, senha })
      const { secret: newSecret, provisioningUri: uri } = res.data
      setSecret(newSecret)
      setProvisioningUri(uri)
      const dataUrl = await QRCode.toDataURL(uri, { width: 250, margin: 2 })
      setQrDataUrl(dataUrl)
      setStep('qr')
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao iniciar configuração')
    } finally {
      setLoading(false)
    }
  }, [email, senha])

  const handleVerifySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await axios.post('/auth/2fa/verify-setup', { email, senha, codigo })
      setMensagem(res.data.message)
      setStep('done')
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Código inválido')
    } finally {
      setLoading(false)
    }
  }, [email, senha, codigo])

  const handleDisable = useCallback(async () => {
    setErro('')
    setLoading(true)
    try {
      const res = await axios.post('/auth/2fa/disable', { email, senha })
      setMensagem(res.data.message)
      navigate('/configuracoes', { replace: true })
    } catch (err: any) {
      setErro(err.response?.data?.error || 'Erro ao desativar 2FA')
    } finally {
      setLoading(false)
    }
  }, [email, senha, navigate])

  return {
    email,
    senha, setSenha,
    step, setStep,
    qrDataUrl,
    secret,
    codigo, setCodigo,
    erro, loading, mensagem,
    handlePasswordSubmit,
    handleVerifySubmit,
    handleDisable,
    navigate,
  }
}
