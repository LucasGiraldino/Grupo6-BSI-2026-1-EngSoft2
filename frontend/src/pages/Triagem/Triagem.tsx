import { useState, useCallback } from 'react'
import { Plus, Stethoscope } from 'lucide-react'
import Toast from '../../components/Toast'
import { useTriagemData } from './hooks/useTriagemData'
import { useTriagemForm } from './hooks/useTriagemForm'
import TriagemFilters from './components/TriagemFilters'
import TriagemTable from './components/TriagemTable'
import TriagemFormModal from './components/TriagemFormModal'
import TriagemDeleteModal from './components/TriagemDeleteModal'

export default function TriagemPage() {
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const {
    triagens,
    medicos,
    carregando,
    filtroPacienteNome,
    setFiltroPacienteNome,
    filtroMedicoId,
    setFiltroMedicoId,
    idParaExcluir,
    setIdParaExcluir,
    carregarDados,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  } = useTriagemData(mostrarToast)

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
    searchEmpty,
    onProntuarioInputChange,
    selecionarProntuario,
    limparProntuario,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  } = useTriagemForm(carregarDados, mostrarToast)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#030213]/5 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-[#030213]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Triagem</h3>
        </div>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Triagem
        </button>
      </div>

      <TriagemFilters
        filtroPacienteNome={filtroPacienteNome}
        filtroMedicoId={filtroMedicoId}
        medicos={medicos}
        onPacienteNomeChange={setFiltroPacienteNome}
        onMedicoIdChange={setFiltroMedicoId}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <TriagemTable
        triagens={triagens}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={(id) => setIdParaExcluir(id)}
      />

      <TriagemFormModal
        aberto={modalAberto}
        form={form}
        erroForm={erroForm}
        prontuarioSearch={prontuarioSearch}
        prontuarioResults={prontuarioResults}
        searchingProntuario={searchingProntuario}
        showProntuarioDropdown={showProntuarioDropdown}
        searchEmpty={searchEmpty}
        medicos={medicos}
        onFormChange={(f) => setForm(f)}
        onProntuarioInputChange={onProntuarioInputChange}
        onSelecionarProntuario={selecionarProntuario}
        onLimparProntuario={limparProntuario}
        onFechar={fecharModal}
        onSalvar={salvar}
        onShowProntuarioDropdownChange={(v) => setShowProntuarioDropdown(v)}
      />

      <TriagemDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
