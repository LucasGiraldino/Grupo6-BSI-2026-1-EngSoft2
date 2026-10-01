import { useEffect, useState } from 'react'
import { toastSubject, type ToastEvent } from '../services/toastService'

export function useToastObserver() {
  const [evento, setEvento] = useState<ToastEvent | null>(null)

  useEffect(() => toastSubject.assinar(setEvento), [])

  const fechar = () => setEvento(null)

  return { evento, fechar }
}
