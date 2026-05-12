import { NavLink, useNavigate } from 'react-router-dom'
import * as lucide from 'lucide-react'

interface SidebarProps {
  systemName?: string
  systemSubtitle?: string
}

export default function Sidebar({ systemName = 'SIGAAC', systemSubtitle = 'Sistema Integrado de Gestão' }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  const menuItems = [
    { to: '/dashboard', icon: lucide.Home, label: 'Dashboard' },
    { to: '/pacientes', icon: lucide.Users, label: 'Pacientes' },
    { to: '/profissionais', icon: lucide.UserCog, label: 'Profissionais' },
    { to: '/consultas', icon: lucide.Calendar, label: 'Consultas' },
    { to: '/prontuarios', icon: lucide.FileText, label: 'Prontuários' },
    { to: '/alimentos', icon: lucide.Package, label: 'Alimentos' },

    // Adicionado aqui! Usando o ícone Heart (Coração) para Doações
    { to: '/doacoes', icon: lucide.Heart, label: 'Doações' },

    { to: '/compras', icon: lucide.ShoppingCart, label: 'Compras' },
    { to: '/exames', icon: lucide.TestTube, label: 'Exames' },
    { to: '/triagem', icon: lucide.Stethoscope, label: 'Triagem' },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="px-6 py-3.5 border-b border-gray-200">
        <div className="text-xl font-semibold text-gray-900">{systemName}</div>
        <div className="text-sm text-gray-500 mt-1 line-clamp-1">{systemSubtitle}</div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                isActive ? 'bg-[#030213] text-white' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-1">
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
              isActive ? 'bg-[#030213] text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <lucide.Settings className="w-5 h-5" />
          Configurações
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          <lucide.LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}