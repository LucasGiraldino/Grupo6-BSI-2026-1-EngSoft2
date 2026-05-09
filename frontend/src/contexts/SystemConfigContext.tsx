import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import api from '../services/api'

interface SystemConfig {
  nomeFantasia: string
  razaoSocial: string
}

const SystemConfigContext = createContext<{
  config: SystemConfig
  refresh: () => void
}>({
  config: { nomeFantasia: 'SIGAAC', razaoSocial: 'Sistema Integrado de Gestão' },
  refresh: () => {},
})

export function SystemConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<SystemConfig>({
    nomeFantasia: 'SIGAAC',
    razaoSocial: 'Sistema Integrado de Gestão',
  })

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
                nomeFantasia: res.data.parametrizacao.nomeFantasia || 'SIGAAC',
                razaoSocial: res.data.parametrizacao.razaoSocial || 'Sistema Integrado de Gestão',
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
