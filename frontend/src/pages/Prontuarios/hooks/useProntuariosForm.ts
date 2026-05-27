import { useState, useCallback } from 'react'
import { Prontuario } from './useProntuariosData'
import { atualizarProntuario } from '../../../services/prontuarioService'

export function useProntuariosForm(
  carregarProntuarios: (q?: string) => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<Prontuario | null>(null)
  const [observacoes, setObservacoes] = useState('')
  const [dataFechamento, setDataFechamento] = useState('')
  const [erroForm, setErroForm] = useState('')

  const abrirModal = useCallback((p: Prontuario) => {
    setEditando(p)
    setObservacoes(p.observacoesGerais ?? '')
    setDataFechamento(p.dataFechamento ?? '')
    setErroForm('')
    setModalAberto(true)
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editando) return
    try {
      await atualizarProntuario(editando.id, {
        observacoesGerais: observacoes || null,
        dataFechamento: dataFechamento || null,
        paciente: { id: editando.paciente.id },
      })
      mostrarToast('Prontuário atualizado com sucesso!', 'sucesso')
      setModalAberto(false)
      carregarProntuarios()
    } catch {
      setErroForm('Erro ao salvar prontuário.')
    }
  }, [editando, observacoes, dataFechamento, carregarProntuarios, mostrarToast])

  const fecharModal = useCallback(() => setModalAberto(false), [])

  return {
    modalAberto,
    editando,
    observacoes,
    setObservacoes,
    dataFechamento,
    setDataFechamento,
    erroForm,
    abrirModal,
    salvar,
    fecharModal,
  }
}
