import { Plus } from 'lucide-react'
import { useAlimentosData } from './hooks/useAlimentosData'
import { useAlimentosForm } from './hooks/useAlimentosForm'
import AlimentosFilters from './components/AlimentosFilters'
import AlimentosTable from './components/AlimentosTable'
import AlimentosFormModal from './components/AlimentosFormModal'
import AlimentosCategoriaModal from './components/AlimentosCategoriaModal'
import AlimentosDeleteModal from './components/AlimentosDeleteModal'

export default function AlimentosPage() {
  const {
    alimentos,
    categorias,
    carregando,
    filtroNome,
    setFiltroNome,
    filtroCategoriaId,
    setFiltroCategoriaId,
    idParaExcluir,
    setIdParaExcluir,
    carregarAlimentos,
    carregarCategorias,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  } = useAlimentosData()

  const {
    modalAberto,
    form,
    setForm,
    erroForm,
    modalCatAberto,
    novaCategoria,
    setNovaCategoria,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
    abrirModalCategoria,
    fecharModalCategoria,
    criarNovaCategoria,
    excluirCategoriaAction,
  } = useAlimentosForm(carregarAlimentos, carregarCategorias)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Alimentos</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Novo Alimento
        </button>
      </div>

      <AlimentosFilters
        filtroNome={filtroNome}
        filtroCategoriaId={filtroCategoriaId}
        categorias={categorias}
        onNomeChange={setFiltroNome}
        onCategoriaIdChange={setFiltroCategoriaId}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <AlimentosTable
        alimentos={alimentos}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <AlimentosFormModal
        aberto={modalAberto}
        form={form}
        erroForm={erroForm}
        categorias={categorias}
        onFormChange={setForm}
        onAbrirCategoriaModal={abrirModalCategoria}
        onSalvar={salvar}
        onFechar={fecharModal}
      />

      <AlimentosCategoriaModal
        aberto={modalCatAberto}
        categorias={categorias}
        novaCategoria={novaCategoria}
        onNovaCategoriaChange={setNovaCategoria}
        onCriarCategoria={criarNovaCategoria}
        onExcluirCategoria={excluirCategoriaAction}
        onFechar={fecharModalCategoria}
      />

      <AlimentosDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />
    </>
  )
}
