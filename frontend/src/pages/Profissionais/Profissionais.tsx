import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Toast from '../../components/Toast'
import { useProfissionaisData } from './hooks/useProfissionaisData'
import { useProfissionaisForm } from './hooks/useProfissionaisForm'
import ProfissionaisFilters from './components/ProfissionaisFilters'
import ProfissionaisTable from './components/ProfissionaisTable'
import ProfissionaisFormModal from './components/ProfissionaisFormModal'
import ProfissionaisDeleteModal from './components/ProfissionaisDeleteModal'

export default function ProfissionaisPage() {
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const {
    profissionais,
    carregando,
    filtroNome,
    setFiltroNome,
    filtroEspecialidade,
    setFiltroEspecialidade,
    idParaExcluir,
    setIdParaExcluir,
    carregar,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  } = useProfissionaisData(mostrarToast)

  const {
    modalAberto,
    form,
    setForm,
    erroForm,
    usuarios,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  } = useProfissionaisForm(carregar, mostrarToast)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Profissionais</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Novo Profissional
        </button>
      </div>

      <ProfissionaisFilters
        filtroNome={filtroNome}
        filtroEspecialidade={filtroEspecialidade}
        onNomeChange={setFiltroNome}
        onEspecialidadeChange={setFiltroEspecialidade}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <ProfissionaisTable
        profissionais={profissionais}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <ProfissionaisFormModal
        aberto={modalAberto}
        form={form}
        erroForm={erroForm}
        usuarios={usuarios}
        onFormChange={setForm}
        onSalvar={salvar}
        onFechar={fecharModal}
      />

      <ProfissionaisDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
