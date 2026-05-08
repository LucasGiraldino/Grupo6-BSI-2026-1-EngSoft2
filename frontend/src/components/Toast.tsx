import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

interface ToastProps {
  aberto: boolean
  mensagem: string
  tipo?: 'sucesso' | 'erro' | 'aviso' | 'info'
  onFechar: () => void
  duracao?: number
}

const ICONES = {
  sucesso: CheckCircle,
  erro: AlertCircle,
  aviso: AlertTriangle,
  info: Info,
}

const CORES = {
  sucesso: 'bg-green-50 border-green-200 text-green-800',
  erro: 'bg-red-50 border-red-200 text-red-800',
  aviso: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
}

const CORES_ICONE = {
  sucesso: 'text-green-500',
  erro: 'text-red-500',
  aviso: 'text-yellow-500',
  info: 'text-blue-500',
}

export default function Toast({ aberto, mensagem, tipo = 'erro', onFechar, duracao = 4000 }: ToastProps) {
  useEffect(() => {
    if (!aberto) return
    const timer = setTimeout(onFechar, duracao)
    return () => clearTimeout(timer)
  }, [aberto, duracao, onFechar])

  if (!aberto) return null

  const Icone = ICONES[tipo]

  return (
    <div className="fixed top-6 right-6 z-[100] animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${CORES[tipo]}`}>
        <Icone className={`w-5 h-5 flex-shrink-0 ${CORES_ICONE[tipo]}`} />
        <span className="text-sm font-medium">{mensagem}</span>
        <button onClick={onFechar} className="p-0.5 hover:opacity-70 transition-opacity flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
