import { useState, useCallback, useEffect } from 'react'
import type { Triagem, Medico } from '../../../types'
import { listarTriagens, listarMedicos, excluirTriagem } from '../../../services/triagemService'

export function useTriagemData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [triagens, setTriagens] = useState<Triagem[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroPacienteNome, setFiltroPacienteNome] = useState('')
  const [filtroMedicoId, setFiltroMedicoId] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregarDados = useCallback(async (pacienteNome?: string, medicoId?: string) => {
    setCarregando(true)
    try {
      const [triagensData, medicosData] = await Promise.all([
        listarTriagens(pacienteNome, medicoId),
        listarMedicos(),
      ])
      setTriagens(triagensData)
      setMedicos(medicosData)
    } catch {}
    setCarregando(false)
  }, [])

  useEffect(() => { carregarDados() }, [carregarDados])

  const handleBuscar = useCallback(() => {
    carregarDados(filtroPacienteNome, filtroMedicoId)
  }, [carregarDados, filtroPacienteNome, filtroMedicoId])

  const handleLimparFiltros = useCallback(() => {
    setFiltroPacienteNome('')
    setFiltroMedicoId('')
    carregarDados()
  }, [carregarDados])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirTriagem(idParaExcluir)
      mostrarToast('Triagem excluída com sucesso!', 'sucesso')
    } catch {}
    setIdParaExcluir(null)
    carregarDados()
  }, [idParaExcluir, carregarDados, mostrarToast])

  return {
    triagens,
    medicos,
    carregando,
    filtroPacienteNome,
    setFiltroPacienteNome,
    filtroMedicoId,
    setFiltroMedicoId,
    idParaExcluir,
    setIdParaExcluir,
    carregarDados,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  }
}
