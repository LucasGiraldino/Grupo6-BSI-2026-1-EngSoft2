import { useState, useCallback, useEffect } from 'react'
import { listarPacientes, excluirPaciente } from '../../../services/pacienteService'
import type { Paciente } from '../../../types'
export type { Paciente }

export function usePacienteData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroCpf, setFiltroCpf] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregarPacientes = useCallback(async (nome?: string, cpf?: string) => {
    setCarregando(true)
    try {
      const data = await listarPacientes(nome, cpf)
      setPacientes(data)
    } catch {}
    setCarregando(false)
  }, [])

  useEffect(() => { carregarPacientes() }, [carregarPacientes])

  const handleBuscar = useCallback(() => {
    carregarPacientes(filtroNome, filtroCpf)
  }, [carregarPacientes, filtroNome, filtroCpf])

  const handleLimparFiltros = useCallback(() => {
    setFiltroNome('')
    setFiltroCpf('')
    carregarPacientes()
  }, [carregarPacientes])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirPaciente(idParaExcluir)
      mostrarToast('Paciente excluído com sucesso!', 'sucesso')
    } catch {}
    setIdParaExcluir(null)
    carregarPacientes()
  }, [idParaExcluir, carregarPacientes, mostrarToast])

  return {
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
  }
}
