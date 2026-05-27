import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import Toast from '../../components/Toast'
import { useUsuariosData } from './hooks/useUsuariosData'
import { useUsuariosForm } from './hooks/useUsuariosForm'
import UsuariosFilters from './components/UsuariosFilters'
import UsuariosTable from './components/UsuariosTable'
import UsuariosFormModal from './components/UsuariosFormModal'
import UsuariosDeleteModal from './components/UsuariosDeleteModal'

export default function GerenciarUsuarios() {
  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  const mostrarToast = useCallback((mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') => {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }, [])

  const {
    usuarios,
    carregando,
    filtroSearch,
    setFiltroSearch,
    filtroPerfil,
    setFiltroPerfil,
    idParaExcluir,
    setIdParaExcluir,
    carregarUsuarios,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  } = useUsuariosData(mostrarToast)

  const {
    modalAberto,
    editandoId,
    form,
    setForm,
    erroForm,
    salvando,
    buscandoCep,
    buscarDadosPorCep,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  } = useUsuariosForm(carregarUsuarios, mostrarToast)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Gerenciar Usuários</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      <UsuariosFilters
        filtroSearch={filtroSearch}
        filtroPerfil={filtroPerfil}
        onSearchChange={setFiltroSearch}
        onPerfilChange={setFiltroPerfil}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <UsuariosTable
        usuarios={usuarios}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <UsuariosFormModal
        aberto={modalAberto}
        editandoId={editandoId}
        form={form}
        erroForm={erroForm}
        salvando={salvando}
        buscandoCep={buscandoCep}
        usuarios={usuarios}
        onFormChange={(f) => setForm(f)}
        onCepBlur={() => buscarDadosPorCep(form.enderecoCep)}
        onFechar={fecharModal}
        onSalvar={salvar}
      />

      <UsuariosDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
