import { Plus } from 'lucide-react'
import { useComprasData } from './hooks/useComprasData'
import { useComprasForm } from './hooks/useComprasForm'
import ComprasFilters from './components/ComprasFilters'
import ComprasTable from './components/ComprasTable'
import ComprasFormModal from './components/ComprasFormModal'
import ComprasDeleteModal from './components/ComprasDeleteModal'

export default function ComprasPage() {
  const {
    compras,
    carregando,
    filtroDataInicio,
    setFiltroDataInicio,
    filtroDataFim,
    setFiltroDataFim,
    filtroObservacoes,
    setFiltroObservacoes,
    idParaExcluir,
    setIdParaExcluir,
    carregar,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  } = useComprasData()

  const {
    modalAberto,
    form,
    setForm,
    itens,
    erroForm,
    alimentos,
    atualizarItem,
    adicionarItem,
    removerItem,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  } = useComprasForm(carregar)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Compras</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Compra
        </button>
      </div>

      <ComprasFilters
        filtroDataInicio={filtroDataInicio}
        filtroDataFim={filtroDataFim}
        filtroObservacoes={filtroObservacoes}
        onDataInicioChange={setFiltroDataInicio}
        onDataFimChange={setFiltroDataFim}
        onObservacoesChange={setFiltroObservacoes}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <ComprasTable
        compras={compras}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <ComprasFormModal
        aberto={modalAberto}
        form={form}
        itens={itens}
        erroForm={erroForm}
        alimentos={alimentos}
        onFormChange={setForm}
        onAtualizarItem={atualizarItem}
        onAdicionarItem={adicionarItem}
        onRemoverItem={removerItem}
        onSalvar={salvar}
        onFechar={fecharModal}
      />

      <ComprasDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

    </>
  )
}
