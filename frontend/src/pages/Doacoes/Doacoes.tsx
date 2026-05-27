import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Toast from '../../components/Toast'
import { useDoacoesData } from './hooks/useDoacoesData'
import { useDoacoesForm } from './hooks/useDoacoesForm'
import DoacoesFilters from './components/DoacoesFilters'
import DoacoesTable from './components/DoacoesTable'
import DoacoesFormModal from './components/DoacoesFormModal'
import DoacoesDeleteModal from './components/DoacoesDeleteModal'

export default function DoacoesPage() {
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const {
    doacoes,
    carregando,
    filtroPacienteNome,
    setFiltroPacienteNome,
    filtroDataInicio,
    setFiltroDataInicio,
    filtroDataFim,
    setFiltroDataFim,
    idParaExcluir,
    setIdParaExcluir,
    carregarDoacoes,
    carregarPacientes,
    carregarEstoque,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  } = useDoacoesData(mostrarToast)

  const {
    modalAberto,
    state,
    setPacienteSelecionadoId,
    setAlimentoSelecionadoId,
    setQuantidadeInput,
    setObservacoes,
    abrirModalNovo,
    abrirModalEdicao,
    handleAdicionarItem,
    handleRemoverItem,
    salvar,
    fecharModal,
  } = useDoacoesForm(carregarDoacoes, carregarPacientes, carregarEstoque, mostrarToast)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Doações</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Doação
        </button>
      </div>

      <DoacoesFilters
        filtroPacienteNome={filtroPacienteNome}
        filtroDataInicio={filtroDataInicio}
        filtroDataFim={filtroDataFim}
        onPacienteNomeChange={setFiltroPacienteNome}
        onDataInicioChange={setFiltroDataInicio}
        onDataFimChange={setFiltroDataFim}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <DoacoesTable
        doacoes={doacoes}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <DoacoesFormModal
        aberto={modalAberto}
        state={state}
        onPacienteSelecionadoIdChange={setPacienteSelecionadoId}
        onAlimentoSelecionadoIdChange={setAlimentoSelecionadoId}
        onQuantidadeInputChange={setQuantidadeInput}
        onObservacoesChange={setObservacoes}
        onAdicionarItem={handleAdicionarItem}
        onRemoverItem={handleRemoverItem}
        onSalvar={salvar}
        onFechar={fecharModal}
      />

      <DoacoesDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
