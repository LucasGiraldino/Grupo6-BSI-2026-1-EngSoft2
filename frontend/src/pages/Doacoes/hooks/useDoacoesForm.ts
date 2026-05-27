import { useState, useCallback } from 'react'
import { Doacao, TabelaItem, Paciente, EstoqueItem } from './useDoacoesData'
import { criarDoacao, atualizarDoacao } from '../../../services/doacaoService'

export interface DoacoesFormState {
  editandoId: number | null
  pacienteSelecionadoId: number | ''
  alimentoSelecionadoId: number | ''
  quantidadeInput: string
  cesta: TabelaItem[]
  observacoes: string
  mensagemErro: string
  pacientes: Paciente[]
  estoque: EstoqueItem[]
}

const FORM_VAZIO: DoacoesFormState = {
  editandoId: null,
  pacienteSelecionadoId: '',
  alimentoSelecionadoId: '',
  quantidadeInput: '',
  cesta: [],
  observacoes: '',
  mensagemErro: '',
  pacientes: [],
  estoque: [],
}

export function useDoacoesForm(
  carregarDoacoes: (nomePaciente?: string, dataInicio?: string, dataFim?: string) => Promise<void>,
  carregarPacientesFn: () => Promise<Paciente[]>,
  carregarEstoqueFn: () => Promise<EstoqueItem[]>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [state, setState] = useState<DoacoesFormState>(FORM_VAZIO)

  const setPacienteSelecionadoId = useCallback((v: number | '') => {
    setState(s => ({ ...s, pacienteSelecionadoId: v }))
  }, [])

  const setAlimentoSelecionadoId = useCallback((v: number | '') => {
    setState(s => ({ ...s, alimentoSelecionadoId: v }))
  }, [])

  const setQuantidadeInput = useCallback((v: string) => {
    setState(s => ({ ...s, quantidadeInput: v }))
  }, [])

  const setObservacoes = useCallback((v: string) => {
    setState(s => ({ ...s, observacoes: v }))
  }, [])

  const abrirModalNovo = useCallback(async () => {
    const [pacientes, estoque] = await Promise.all([
      carregarPacientesFn(),
      carregarEstoqueFn(),
    ])
    setState({ ...FORM_VAZIO, pacientes, estoque })
    setModalAberto(true)
  }, [carregarPacientesFn, carregarEstoqueFn])

  const abrirModalEdicao = useCallback(async (d: Doacao) => {
    const cesta = d.itens?.map(i => ({
      idAlimento: i.alimento.id,
      nomeAlimento: i.alimento.nome,
      quantidade: i.quantidade,
      unidadeMedida: i.alimento.unidadeMedida || '',
    })) || []

    const [pacientes, estoque] = await Promise.all([
      carregarPacientesFn(),
      carregarEstoqueFn(),
    ])

    setState({
      editandoId: d.id,
      pacienteSelecionadoId: d.paciente?.id || '',
      alimentoSelecionadoId: '',
      quantidadeInput: '',
      cesta,
      observacoes: d.observacoes || '',
      mensagemErro: '',
      pacientes,
      estoque,
    })
    setModalAberto(true)
  }, [carregarPacientesFn, carregarEstoqueFn])

  const handleAdicionarItem = useCallback(() => {
    setState(s => {
      if (!s.alimentoSelecionadoId) {
        return { ...s, mensagemErro: 'Selecione um mantimento antes de adicionar.' }
      }

      const qtd = s.quantidadeInput ? parseFloat(s.quantidadeInput) : 1
      const itemEstoque = s.estoque.find(item => item.alimento.id === Number(s.alimentoSelecionadoId))
      if (!itemEstoque) return s

      const itemExistenteIdx = s.cesta.findIndex(i => i.idAlimento === itemEstoque.alimento.id)
      let novaCesta: TabelaItem[]
      if (itemExistenteIdx > -1) {
        novaCesta = [...s.cesta]
        novaCesta[itemExistenteIdx] = {
          ...novaCesta[itemExistenteIdx],
          quantidade: novaCesta[itemExistenteIdx].quantidade + qtd,
        }
      } else {
        novaCesta = [...s.cesta, {
          idAlimento: itemEstoque.alimento.id,
          nomeAlimento: itemEstoque.alimento.nome,
          quantidade: qtd,
          unidadeMedida: itemEstoque.alimento.unidadeMedida,
        }]
      }

      return {
        ...s,
        cesta: novaCesta,
        alimentoSelecionadoId: '',
        quantidadeInput: '',
        mensagemErro: '',
      }
    })
  }, [])

  const handleRemoverItem = useCallback((idAlimento: number) => {
    setState(s => ({ ...s, cesta: s.cesta.filter(i => i.idAlimento !== idAlimento) }))
  }, [])

  const salvar = useCallback(async () => {
    const current = state
    if (!current.pacienteSelecionadoId) {
      setState(s => ({ ...s, mensagemErro: 'Selecione o paciente beneficiário antes de salvar.' }))
      return
    }
    if (current.cesta.length === 0) {
      setState(s => ({ ...s, mensagemErro: 'Adicione pelo menos um mantimento na cesta.' }))
      return
    }

    const body = {
      idPaciente: Number(current.pacienteSelecionadoId),
      idProfissional: 1,
      observacoes: current.observacoes,
      itens: current.cesta.map(item => ({
        idAlimento: item.idAlimento,
        quantidade: item.quantidade,
      })),
    }

    try {
      if (current.editandoId) {
        await atualizarDoacao(current.editandoId, body)
        mostrarToast('Doação atualizada com sucesso!', 'sucesso')
      } else {
        await criarDoacao(body)
        mostrarToast('Doação cadastrada com sucesso!', 'sucesso')
      }
      setModalAberto(false)
      carregarDoacoes()
    } catch (err: any) {
      const data = err.response?.data
      const msg = typeof data === 'string' ? data : data?.error || 'Erro ao registrar doação no servidor.'
      setState(s => ({ ...s, mensagemErro: msg }))
    }
  }, [state, carregarDoacoes, mostrarToast])

  const fecharModal = useCallback(() => {
    setModalAberto(false)
  }, [])

  const setMensagemErro = useCallback((msg: string) => {
    setState(s => ({ ...s, mensagemErro: msg }))
  }, [])

  return {
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
    setMensagemErro,
  }
}
