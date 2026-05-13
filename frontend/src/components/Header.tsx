import { Bell, Menu } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  logoUrl?: string | null
  userEmail?: string | null
  isAdmin?: boolean
}

export default function Header({ title, subtitle, logoUrl, userEmail, isAdmin }: HeaderProps) {
  const initials = userEmail ? userEmail.substring(0, 2).toUpperCase() : '??'

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        {logoUrl && (
          <img src={logoUrl} alt={title} className="w-8 h-8 rounded-lg object-cover" />
        )}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 line-clamp-1">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{userEmail || 'Usuário'}</p>
            <p className="text-xs text-gray-500">{isAdmin ? 'Administrador' : 'Usuário'}</p>
          </div>
          <div className="w-10 h-10 bg-[#030213] rounded-full flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  )
}
