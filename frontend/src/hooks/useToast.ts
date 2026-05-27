import { useState, useCallback } from 'react'

interface UseToastReturn {
  toastAberto: boolean
  toastMensagem: string
  toastTipo: 'sucesso' | 'erro' | 'aviso' | 'info'
  mostrarToast: (mensagem: string, tipo?: 'sucesso' | 'erro' | 'aviso' | 'info') => void
  fecharToast: () => void
}

export function useToast(): UseToastReturn {
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const fecharToast = useCallback(() => setToastAberto(false), [])

  return { toastAberto, toastMensagem, toastTipo, mostrarToast, fecharToast }
}
