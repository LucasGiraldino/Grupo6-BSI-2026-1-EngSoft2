import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSystemConfig } from '../contexts/SystemConfigContext'
import { useAuth } from '../hooks/useAuth'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { config } = useSystemConfig()
  const { isAdmin, email } = useAuth()

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar systemName={config.nomeFantasia} systemSubtitle={config.razaoSocial} logoUrl={config.logoUrl} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={config.nomeFantasia} subtitle={config.razaoSocial} logoUrl={config.logoUrl} userEmail={email} isAdmin={isAdmin} />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}
