interface UserConfig {
  usuarioEhAdministrador: boolean
  parametrizacao?: {
    nomeFantasia: string
    razaoSocial: string
  }
}

export function useAuth() {
  const email = localStorage.getItem('userEmail')
  const isAuthenticated = !!email

  const checkAdmin = async (): Promise<boolean> => {
    if (!email) return false
    try {
      const res = await fetch(`/api/parametrizacao/configuracao-sistema?email=${encodeURIComponent(email)}`)
      const config: UserConfig = await res.json()
      return config.usuarioEhAdministrador
    } catch {
      return false
    }
  }

  return {
    isAuthenticated,
    isAdmin: false, // Simplificado - em produção usar estado
    checkAdmin,
    logout: () => {
      localStorage.removeItem('userEmail')
      window.location.href = '/login'
    }
  }
}
