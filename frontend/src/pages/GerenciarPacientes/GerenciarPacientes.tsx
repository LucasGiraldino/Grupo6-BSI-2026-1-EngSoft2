import { Plus } from 'lucide-react'
import { toast } from '../../services/toastService'
import { usePacienteData } from './hooks/usePacienteData'
import { usePacienteForm } from './hooks/usePacienteForm'
import PacienteFilters from './components/PacienteFilters'
import PacienteTable from './components/PacienteTable'
import PacienteFormModal from './components/PacienteFormModal'
import PacienteDeleteModal from './components/PacienteDeleteModal'

export default function GerenciarPacientes() {
  const {
    pacientes,
    carregando,
    filtroNome,
    setFiltroNome,
    filtroCpf,
    setFiltroCpf,
    idParaExcluir,
    setIdParaExcluir,
    carregarPacientes,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  } = usePacienteData(toast.mostrar)

  const {
    modalAberto,
    form,
    setForm,
    erroForm,
    buscandoCpf,
    buscandoCep,
    temErro,
    limparErro,
    buscarDadosPorCpf,
    buscarDadosPorCep,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  } = usePacienteForm(carregarPacientes, toast.mostrar)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Pacientes</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </button>
      </div>

      <PacienteFilters
        filtroNome={filtroNome}
        filtroCpf={filtroCpf}
        onNomeChange={setFiltroNome}
        onCpfChange={setFiltroCpf}
        onBuscar={handleBuscar}
        onLimpar={handleLimparFiltros}
      />

      <PacienteTable
        pacientes={pacientes}
        carregando={carregando}
        onEditar={abrirModalEdicao}
        onExcluir={setIdParaExcluir}
      />

      <PacienteFormModal
        aberto={modalAberto}
        form={form}
        erroForm={erroForm}
        buscandoCpf={buscandoCpf}
        buscandoCep={buscandoCep}
        onFormChange={(f) => setForm(f)}
        onCpfBlur={() => !form.id && buscarDadosPorCpf(form.cpf)}
        onCepBlur={() => buscarDadosPorCep(form.enderecoCep)}
        temErro={temErro}
        limparErro={limparErro}
        onFechar={fecharModal}
        onSalvar={salvar}
      />

      <PacienteDeleteModal
        aberto={idParaExcluir !== null}
        onConfirmar={confirmarDelete}
        onCancelar={() => setIdParaExcluir(null)}
      />

    </>
  )
}
