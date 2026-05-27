import { useState, useCallback } from 'react'
import api from '../../../services/api'
import type { EstoqueItem, TabelaItem } from '../../../types'
export type { TabelaItem }

export function useEfetuarDoacaoForm(
  estoque: EstoqueItem[],
  carregarEstoque: () => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState<number | ''>('')
  const [alimentoSelecionadoId, setAlimentoSelecionadoId] = useState<number | ''>('')
  const [quantidadeInput, setQuantidadeInput] = useState<string>('')
  const [cesta, setCesta] = useState<TabelaItem[]>([])
  const [observacoes, setObservacoes] = useState('')
  const [dataDoacao, setDataDoacao] = useState(new Date().toISOString().split('T')[0])
  const [mensagemErro, setMensagemErro] = useState('')

  const handleAdicionarItem = useCallback(() => {
    setMensagemErro('')

    if (!alimentoSelecionadoId) {
      setMensagemErro('Selecione um mantimento antes de adicionar.')
      return
    }

    const qtd = quantidadeInput ? parseFloat(quantidadeInput) : 1
    const itemEstoque = estoque.find(item => item.alimento.id === Number(alimentoSelecionadoId))
    if (!itemEstoque) return

    setCesta(prev => {
      const itemExistenteIdx = prev.findIndex(i => i.idAlimento === itemEstoque.alimento.id)
      if (itemExistenteIdx > -1) {
        const novaCesta = [...prev]
        novaCesta[itemExistenteIdx] = {
          ...novaCesta[itemExistenteIdx],
          quantidade: novaCesta[itemExistenteIdx].quantidade + qtd,
        }
        return novaCesta
      }
      return [...prev, {
        idAlimento: itemEstoque.alimento.id,
        nomeAlimento: itemEstoque.alimento.nome,
        quantidade: qtd,
        unidadeMedida: itemEstoque.alimento.unidadeMedida,
      }]
    })

    setAlimentoSelecionadoId('')
    setQuantidadeInput('')
  }, [alimentoSelecionadoId, quantidadeInput, estoque])

  const handleRemoverItem = useCallback((idAlimento: number) => {
    setCesta(prev => prev.filter(i => i.idAlimento !== idAlimento))
  }, [])

  const handleSalvarDoacao = useCallback(async () => {
    setMensagemErro('')

    if (!pacienteSelecionadoId) {
      setMensagemErro('Selecione o paciente beneficiário antes de salvar.')
      return
    }

    if (cesta.length === 0) {
      setMensagemErro('Adicione pelo menos um mantimento na cesta.')
      return
    }

    try {
      await api.post('/api/doacoes', {
        idPaciente: Number(pacienteSelecionadoId),
        idProfissional: 1,
        observacoes,
        itens: cesta.map(item => ({
          idAlimento: item.idAlimento,
          quantidade: item.quantidade,
        })),
      })

      mostrarToast('Doação cadastrada com sucesso!', 'sucesso')
      setCesta([])
      setPacienteSelecionadoId('')
      setObservacoes('')
      carregarEstoque()
    } catch (err: any) {
      const data = err.response?.data
      setMensagemErro(typeof data === 'string' ? data : data?.error || 'Erro ao registrar doação no servidor.')
    }
  }, [pacienteSelecionadoId, cesta, observacoes, mostrarToast, carregarEstoque])

  return {
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
  }
}
