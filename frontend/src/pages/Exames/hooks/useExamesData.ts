import { useState, useCallback, useEffect } from 'react'
import { listarExames, listarTiposExame, listarMedicosExame, excluirExame } from '../../../services/exameService'
import type { TipoExame, Medico, Exame } from '../../../types'
export type { Exame }

export function useExamesData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [exames, setExames] = useState<Exame[]>([])
  const [tiposExame, setTiposExame] = useState<TipoExame[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroTipoExame, setFiltroTipoExame] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregarDados = useCallback(async (status?: string, tipoExameNome?: string) => {
    setCarregando(true)
    try {
      const [examesData, tiposData, medicosData] = await Promise.all([
        listarExames(status, tipoExameNome),
        listarTiposExame(),
        listarMedicosExame(),
      ])
      setExames(examesData)
      setTiposExame(tiposData)
      setMedicos(medicosData)
    } catch {}
    setCarregando(false)
  }, [])

  useEffect(() => { carregarDados() }, [carregarDados])

  const handleBuscar = useCallback(() => {
    carregarDados(filtroStatus, filtroTipoExame)
  }, [carregarDados, filtroStatus, filtroTipoExame])

  const handleLimparFiltros = useCallback(() => {
    setFiltroStatus('')
    setFiltroTipoExame('')
    carregarDados()
  }, [carregarDados])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirExame(idParaExcluir)
      mostrarToast('Exame excluído com sucesso!', 'sucesso')
    } catch {}
    setIdParaExcluir(null)
    carregarDados()
  }, [idParaExcluir, carregarDados, mostrarToast])

  const atualizarTiposExame = useCallback(async () => {
    try {
      const data = await listarTiposExame()
      setTiposExame(data)
    } catch {}
  }, [])

  return {
    exames,
    tiposExame,
    medicos,
    carregando,
    filtroStatus,
    setFiltroStatus,
    filtroTipoExame,
    setFiltroTipoExame,
    idParaExcluir,
    setIdParaExcluir,
    carregarDados,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
    atualizarTiposExame,
  }
}
