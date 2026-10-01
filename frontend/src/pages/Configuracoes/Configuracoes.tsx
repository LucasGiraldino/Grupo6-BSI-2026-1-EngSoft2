import { Loader } from 'lucide-react'
import { toast } from '../../services/toastService'
import { useSystemConfig } from '../../contexts/SystemConfigContext'
import { useConfigForm } from './hooks/useConfigForm'
import ConfigForm from './components/ConfigForm'

export default function ConfiguracoesPage() {
  const { refresh: refreshConfig } = useSystemConfig()

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
  } = useConfigForm(toast.mostrar, refreshConfig)

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
    </>
  )
}
