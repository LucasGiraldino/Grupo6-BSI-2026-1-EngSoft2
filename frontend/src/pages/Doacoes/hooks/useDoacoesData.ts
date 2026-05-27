import { useState, useCallback, useEffect } from 'react'
import { listarDoacoes, listarPacientesDoacao, listarEstoque, excluirDoacao } from '../../../services/doacaoService'
import type { Paciente, EstoqueItem, Doacao, TabelaItem } from '../../../types'
export type { Paciente, EstoqueItem, Doacao, TabelaItem }

export function useDoacoesData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroPacienteNome, setFiltroPacienteNome] = useState('')
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregarDoacoes = useCallback(async (nomePaciente?: string, dataInicio?: string, dataFim?: string) => {
    setCarregando(true)
    try {
      const data = await listarDoacoes(nomePaciente, dataInicio, dataFim)
      setDoacoes(data)
    } catch {}
    setCarregando(false)
  }, [])

  useEffect(() => { carregarDoacoes() }, [carregarDoacoes])

  const carregarPacientes = useCallback(async () => {
    try {
      return await listarPacientesDoacao() as Paciente[]
    } catch {
      return [] as Paciente[]
    }
  }, [])

  const carregarEstoque = useCallback(async () => {
    try {
      return await listarEstoque() as EstoqueItem[]
    } catch {
      return [] as EstoqueItem[]
    }
  }, [])

  const handleBuscar = useCallback(() => {
    carregarDoacoes(filtroPacienteNome, filtroDataInicio, filtroDataFim)
  }, [carregarDoacoes, filtroPacienteNome, filtroDataInicio, filtroDataFim])

  const handleLimparFiltros = useCallback(() => {
    setFiltroPacienteNome('')
    setFiltroDataInicio('')
    setFiltroDataFim('')
    carregarDoacoes()
  }, [carregarDoacoes])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirDoacao(idParaExcluir)
      mostrarToast('Doação excluída com sucesso!', 'sucesso')
    } catch {}
    setIdParaExcluir(null)
    carregarDoacoes()
  }, [idParaExcluir, carregarDoacoes, mostrarToast])

  return {
    doacoes,
    carregando,
    filtroPacienteNome,
    setFiltroPacienteNome,
    filtroDataInicio,
    setFiltroDataInicio,
    filtroDataFim,
    setFiltroDataFim,
    idParaExcluir,
    setIdParaExcluir,
    carregarDoacoes,
    carregarPacientes,
    carregarEstoque,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  }
}
