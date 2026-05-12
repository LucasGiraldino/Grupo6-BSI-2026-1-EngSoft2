import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import api from '../services/api'

interface SystemConfig {
  nomeFantasia: string
  razaoSocial: string
}

const DEFAULT_CONFIG = { nomeFantasia: 'SIGAAC', razaoSocial: 'Sistema Integrado de Gestão' }

const SystemConfigContext = createContext<{
  config: SystemConfig
  refresh: () => void
}>({
  config: DEFAULT_CONFIG,
  refresh: () => {},
})

export function SystemConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG)

  const fetchConfig = useCallback(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const parts = token.split('.')
      if (parts.length !== 3) return
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
      const email = payload.sub

      if (email) {
        api.get('/api/parametrizacao/configuracao-sistema', { params: { email } })
          .then(res => {
            if (res.data.parametrizacao) {
              setConfig({
                nomeFantasia: res.data.parametrizacao.nomeFantasia || DEFAULT_CONFIG.nomeFantasia,
                razaoSocial: res.data.parametrizacao.razaoSocial || DEFAULT_CONFIG.razaoSocial,
              })
            }
          })
          .catch(() => {})
      }
    } catch {}
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  return (
    <SystemConfigContext.Provider value={{ config, refresh: fetchConfig }}>
      {children}
    </SystemConfigContext.Provider>
  )
}

export const useSystemConfig = () => useContext(SystemConfigContext)
