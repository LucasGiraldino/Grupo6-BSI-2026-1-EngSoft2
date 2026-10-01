import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { toast } from '../../services/toastService'
import { useExamesData } from './hooks/useExamesData'
import { useExamesForm } from './hooks/useExamesForm'
import { criarTipoExame, excluirTipoExame } from '../../services/exameService'
import ExamesFilters from './components/ExamesFilters'
import ExamesTable from './components/ExamesTable'
import ExamesFormModal from './components/ExamesFormModal'
import ExamesTipoModal from './components/ExamesTipoModal'
import ExamesDeleteModal from './components/ExamesDeleteModal'

export default function ExamesPage() {
  const {
    exames,
    tiposExame,
    medicos,
    carregando,
    filtroStatus,
    setFiltroStatus,
    filtroTipoExame,
    setFiltroTipoExame,
    idParaExcluir,
    setIdParaExcluir,
    carregarDados,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
    atualizarTiposExame,
  } = useExamesData(toast.mostrar)

  const {
    modalAberto,
    form,
    setForm,
    erroForm,
    prontuarioSearch,
    prontuarioResults,
    searchingProntuario,
    showProntuarioDropdown,
    setShowProntuarioDropdown,
    onProntuarioInputChange,
    selecionarProntuario,
    limparProntuario,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  } = useExamesForm(carregarDados, toast.mostrar)

  const [modalTipoAberto, setModalTipoAberto] = useState(false)

  const handleCriarTipo = useCallback(async (nome: string, descricao: string | null) => {
    try {
      await criarTipoExame(nome, descricao)
      toast.mostrar('Tipo de exame criado com sucesso!', 'sucesso')
      atualizarTiposExame()
    } catch {
      toast.mostrar('Erro ao criar tipo de exame.', 'erro')
    }
  }, [toast.mostrar, atualizarTiposExame])

  const handleExcluirTipo = useCallback(async (id: number) => {
    try {
      await excluirTipoExame(id)
      toast.mostrar('Tipo de exame excluído com sucesso!', 'sucesso')
      atualizarTiposExame()
    } catch {
      toast.mostrar('Erro ao excluir tipo de exame.', 'erro')
    }
  }, [toast.mostrar, atualizarTiposExame])

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Exames</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Novo Exame
        </button>
      </div>

      <ExamesFilters
        filtroStatus={filtroStatus}
        filtroTipoExame={filtroTipoExame}
        onStatusChange={setFiltroStatus}
        onTipoExameChange={setFiltroTipoExame}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <ExamesTable
        exames={exames}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <ExamesFormModal
        aberto={modalAberto}
        form={form}
        erroForm={erroForm}
        prontuarioSearch={prontuarioSearch}
        prontuarioResults={prontuarioResults}
        searchingProntuario={searchingProntuario}
        showProntuarioDropdown={showProntuarioDropdown}
        medicos={medicos}
        tiposExame={tiposExame}
        onFormChange={(f) => setForm(f)}
        onProntuarioInputChange={onProntuarioInputChange}
        onSelecionarProntuario={selecionarProntuario}
        onLimparProntuario={limparProntuario}
        onAbrirTipoModal={() => setModalTipoAberto(true)}
        onFechar={fecharModal}
        onSalvar={salvar}
        onShowProntuarioDropdownChange={(v) => setShowProntuarioDropdown(v)}
      />

      <ExamesTipoModal
        aberto={modalTipoAberto}
        tiposExame={tiposExame}
        onCriarTipo={handleCriarTipo}
        onExcluirTipo={handleExcluirTipo}
        onFechar={() => setModalTipoAberto(false)}
      />

      <ExamesDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

    </>
  )
}
