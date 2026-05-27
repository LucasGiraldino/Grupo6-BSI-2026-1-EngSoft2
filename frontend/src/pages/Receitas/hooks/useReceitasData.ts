import { useState, useCallback, useEffect } from 'react'
import { listarReceitas, excluirReceita } from '../../../services/receitaService'
import type { Receita } from '../../../types'
export type { Receita }

export function useReceitasData() {
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [carregando, setCarregando] = useState(true)
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const data = await listarReceitas()
      setReceitas(data)
    } catch {}
    setCarregando(false)
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirReceita(idParaExcluir)
    } catch {}
    setIdParaExcluir(null)
    carregar()
  }, [idParaExcluir, carregar])

  return {
    receitas,
    carregando,
    idParaExcluir,
    setIdParaExcluir,
    carregar,
    confirmarDelete,
  }
}
