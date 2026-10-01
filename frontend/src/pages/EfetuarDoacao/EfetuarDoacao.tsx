import { toast } from '../../services/toastService'
import { useEfetuarDoacaoData } from './hooks/useEfetuarDoacaoData'
import { useEfetuarDoacaoForm } from './hooks/useEfetuarDoacaoForm'
import PacienteSelect from './components/PacienteSelect'
import CestaForm from './components/CestaForm'
import CestaTable from './components/CestaTable'

export default function EfetuarDoacao() {
  const { pacientes, estoque, carregarEstoque } = useEfetuarDoacaoData()

  const {
    pacienteSelecionadoId,
    setPacienteSelecionadoId,
    alimentoSelecionadoId,
    setAlimentoSelecionadoId,
    quantidadeInput,
    setQuantidadeInput,
    cesta,
    observacoes,
    setObservacoes,
    dataDoacao,
    setDataDoacao,
    mensagemErro,
    handleAdicionarItem,
    handleRemoverItem,
    handleSalvarDoacao,
  } = useEfetuarDoacaoForm(estoque, carregarEstoque, toast.mostrar)

  return (
    <>
      <div className="grid grid-cols-[1fr_2fr] gap-6">
        <div className="flex flex-col gap-4">
          <PacienteSelect
            pacientes={pacientes}
            value={pacienteSelecionadoId}
            onChange={setPacienteSelecionadoId}
          />
          <CestaForm
            estoque={estoque}
            alimentoSelecionadoId={alimentoSelecionadoId}
            quantidadeInput={quantidadeInput}
            onAlimentoChange={setAlimentoSelecionadoId}
            onQuantidadeChange={setQuantidadeInput}
            onAdicionar={handleAdicionarItem}
          />
        </div>

        <div className="flex flex-col">
          <CestaTable
            cesta={cesta}
            dataDoacao={dataDoacao}
            observacoes={observacoes}
            mensagemErro={mensagemErro}
            onDataChange={setDataDoacao}
            onObservacoesChange={setObservacoes}
            onRemoverItem={handleRemoverItem}
            onSalvar={handleSalvarDoacao}
          />
        </div>
      </div>

    </>
  )
}
