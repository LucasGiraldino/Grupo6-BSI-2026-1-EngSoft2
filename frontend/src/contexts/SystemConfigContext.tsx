import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import api from '../services/api'

interface SystemConfig {
  nomeFantasia: string
  razaoSocial: string
  logoUrl: string | null
}

const DEFAULT_CONFIG = { nomeFantasia: 'SIGAAC', razaoSocial: 'Sistema Integrado de Gestão', logoUrl: null }

const SystemConfigContext = createContext<{
  config: SystemConfig
  parametrizacaoExiste: boolean
  usuarioEhAdministrador: boolean
  loaded: boolean
  refresh: () => void
}>({
  config: DEFAULT_CONFIG,
  parametrizacaoExiste: false,
  usuarioEhAdministrador: false,
  loaded: false,
  refresh: () => {},
})

export function SystemConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG)
  const [parametrizacaoExiste, setParametrizacaoExiste] = useState(false)
  const [usuarioEhAdministrador, setUsuarioEhAdministrador] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchConfig = useCallback(() => {
    const token = localStorage.getItem('token')

    let email: string | null = null
    if (token) {
      try {
        const parts = token.split('.')
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
          email = payload.sub || null
        }
      } catch {}
    }

    api.get('/api/parametrizacao/configuracao-sistema', { params: email ? { email } : {} })
      .then(res => {
        setParametrizacaoExiste(res.data.parametrizacaoExiste || false)
        setUsuarioEhAdministrador(res.data.usuarioEhAdministrador || false)
        if (res.data.parametrizacao) {
          setConfig({
            nomeFantasia: res.data.parametrizacao.nomeFantasia || DEFAULT_CONFIG.nomeFantasia,
            razaoSocial: res.data.parametrizacao.razaoSocial || DEFAULT_CONFIG.razaoSocial,
            logoUrl: res.data.parametrizacao.logoUrl || null,
          })
        } else {
          setConfig(DEFAULT_CONFIG)
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return (
    <SystemConfigContext.Provider value={{ config, parametrizacaoExiste, usuarioEhAdministrador, loaded, refresh: fetchConfig }}>
      {children}
    </SystemConfigContext.Provider>
  )
}

export const useSystemConfig = () => useContext(SystemConfigContext)
