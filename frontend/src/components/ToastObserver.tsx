import Toast from './Toast'
import { useToastObserver } from '../hooks/useToastObserver'

export default function ToastObserver() {
  const { evento, fechar } = useToastObserver()

  if (!evento) return null

  return <Toast aberto mensagem={evento.mensagem} tipo={evento.tipo} onFechar={fechar} />
}
