import { useState, useCallback } from 'react'
import Toast from '../../components/Toast'
import { useProntuariosData } from './hooks/useProntuariosData'
import { useProntuariosForm } from './hooks/useProntuariosForm'
import ProntuariosFilters from './components/ProntuariosFilters'
import ProntuariosTable from './components/ProntuariosTable'
import ProntuariosFormModal from './components/ProntuariosFormModal'

export default function ProntuariosPage() {
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const {
    prontuarios,
    carregando,
    filtro,
    setFiltro,
    carregar,
    handleBuscar,
    handleLimpar,
  } = useProntuariosData()

  const {
    modalAberto,
    editando,
    observacoes,
    setObservacoes,
    dataFechamento,
    setDataFechamento,
    erroForm,
    abrirModal,
    salvar,
    fecharModal,
  } = useProntuariosForm(carregar, mostrarToast)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Prontuários</h3>
      </div>

      <ProntuariosFilters
        filtro={filtro}
        onFiltroChange={setFiltro}
        onBuscar={handleBuscar}
        onLimpar={handleLimpar}
      />

      <ProntuariosTable
        prontuarios={prontuarios}
        carregando={carregando}
        onEditar={abrirModal}
      />

      <ProntuariosFormModal
        aberto={modalAberto}
        editando={editando}
        observacoes={observacoes}
        dataFechamento={dataFechamento}
        erroForm={erroForm}
        onObservacoesChange={setObservacoes}
        onDataFechamentoChange={setDataFechamento}
        onSalvar={salvar}
        onFechar={fecharModal}
      />

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
