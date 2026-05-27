import { Plus } from 'lucide-react'
import { useReceitasData } from './hooks/useReceitasData'
import { useReceitasForm } from './hooks/useReceitasForm'
import ReceitasTable from './components/ReceitasTable'
import ReceitasFormModal from './components/ReceitasFormModal'
import ReceitasDeleteModal from './components/ReceitasDeleteModal'

export default function ReceitasPage() {
  const {
    receitas,
    carregando,
    idParaExcluir,
    setIdParaExcluir,
    carregar,
    confirmarDelete,
  } = useReceitasData()

  const {
    modalAberto,
    form,
    setForm,
    prontuarioId,
    setProntuarioId,
    medicoId,
    setMedicoId,
    erroForm,
    prontuarios,
    medicos,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  } = useReceitasForm(carregar)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Receitas Médicas</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Receita
        </button>
      </div>

      <ReceitasTable
        receitas={receitas}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <ReceitasFormModal
        aberto={modalAberto}
        form={form}
        prontuarioId={prontuarioId}
        medicoId={medicoId}
        erroForm={erroForm}
        prontuarios={prontuarios}
        medicos={medicos}
        onFormChange={setForm}
        onProntuarioIdChange={setProntuarioId}
        onMedicoIdChange={setMedicoId}
        onSalvar={salvar}
        onFechar={fecharModal}
      />

      <ReceitasDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />
    </>
  )
}
