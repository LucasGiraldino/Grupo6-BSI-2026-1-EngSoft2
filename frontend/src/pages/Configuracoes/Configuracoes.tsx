import { useState, useCallback } from 'react'
import { Loader } from 'lucide-react'
import Toast from '../../components/Toast'
import { useSystemConfig } from '../../contexts/SystemConfigContext'
import { useConfigForm } from './hooks/useConfigForm'
import ConfigForm from './components/ConfigForm'

export default function ConfiguracoesPage() {
  const { refresh: refreshConfig } = useSystemConfig()
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const {
    form,
    setForm,
    carregando,
    salvando,
    buscandoCnpj,
    buscandoCep,
    buscarCnpj,
    buscarCep,
    salvar,
    recarregar,
  } = useConfigForm(mostrarToast, refreshConfig)

  if (carregando) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <>
      <ConfigForm
        form={form}
        salvando={salvando}
        buscandoCnpj={buscandoCnpj}
        buscandoCep={buscandoCep}
        onFormChange={setForm}
        onBuscarCnpj={buscarCnpj}
        onBuscarCep={buscarCep}
        onSalvar={salvar}
        onRecarregar={recarregar}
      />
      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
