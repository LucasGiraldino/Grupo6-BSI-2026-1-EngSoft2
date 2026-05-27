import { useState, useCallback, useEffect } from 'react'
import { listarProntuarios } from '../../../services/prontuarioService'
import type { Prontuario } from '../../../types'
export type { Prontuario }

export function useProntuariosData() {
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('')

  const carregar = useCallback(async (q?: string) => {
    setCarregando(true)
    try {
      const data = await listarProntuarios(q)
      setProntuarios(data)
    } catch {}
    setCarregando(false)
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const handleBuscar = useCallback(() => {
    carregar(filtro)
  }, [carregar, filtro])

  const handleLimpar = useCallback(() => {
    setFiltro('')
    carregar()
  }, [carregar])

  return {
    prontuarios,
    carregando,
    filtro,
    setFiltro,
    carregar,
    handleBuscar,
    handleLimpar,
  }
}
