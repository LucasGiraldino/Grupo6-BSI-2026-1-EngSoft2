import { toast } from '../../services/toastService'
import { useProntuariosData } from './hooks/useProntuariosData'
import { useProntuariosForm } from './hooks/useProntuariosForm'
import ProntuariosFilters from './components/ProntuariosFilters'
import ProntuariosTable from './components/ProntuariosTable'
import ProntuariosFormModal from './components/ProntuariosFormModal'

export default function ProntuariosPage() {
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
  } = useProntuariosForm(carregar, toast.mostrar)

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

    </>
  )
}
