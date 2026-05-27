import { useState, useCallback, useEffect } from 'react'
import { listarCompras, excluirCompra } from '../../../services/compraService'
import type { Compra } from '../../../types'
export type { Compra }

export function useComprasData() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')
  const [filtroObservacoes, setFiltroObservacoes] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregar = useCallback(async (dataInicio?: string, dataFim?: string, observacoes?: string) => {
    setCarregando(true)
    try {
      const data = await listarCompras(dataInicio, dataFim, observacoes)
      setCompras(data)
    } catch {}
    setCarregando(false)
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const handleBuscar = useCallback(() => {
    carregar(filtroDataInicio, filtroDataFim, filtroObservacoes)
  }, [carregar, filtroDataInicio, filtroDataFim, filtroObservacoes])

  const handleLimparFiltros = useCallback(() => {
    setFiltroDataInicio('')
    setFiltroDataFim('')
    setFiltroObservacoes('')
    carregar()
  }, [carregar])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirCompra(idParaExcluir)
    } catch {}
    setIdParaExcluir(null)
    carregar()
  }, [idParaExcluir, carregar])

  return {
    compras,
    carregando,
    filtroDataInicio,
    setFiltroDataInicio,
    filtroDataFim,
    setFiltroDataFim,
    filtroObservacoes,
    setFiltroObservacoes,
    idParaExcluir,
    setIdParaExcluir,
    carregar,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  }
}
