import { useState, useCallback, useEffect } from 'react'
import { listarAlimentos, listarCategorias, excluirAlimento } from '../../../services/alimentoService'
import type { Categoria, Alimento } from '../../../types'
export type { Categoria, Alimento }

export function useAlimentosData() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroCategoriaId, setFiltroCategoriaId] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregarAlimentos = useCallback(async (nome?: string, categoriaId?: string) => {
    setCarregando(true)
    try {
      const data = await listarAlimentos(nome, categoriaId)
      setAlimentos(data)
    } catch {}
    setCarregando(false)
  }, [])

  const carregarCategorias = useCallback(async () => {
    try {
      const data = await listarCategorias()
      setCategorias(data)
    } catch {}
  }, [])

  useEffect(() => {
    carregarCategorias()
    carregarAlimentos()
  }, [carregarAlimentos, carregarCategorias])

  const handleBuscar = useCallback(() => {
    carregarAlimentos(filtroNome, filtroCategoriaId)
  }, [carregarAlimentos, filtroNome, filtroCategoriaId])

  const handleLimparFiltros = useCallback(() => {
    setFiltroNome('')
    setFiltroCategoriaId('')
    carregarAlimentos()
  }, [carregarAlimentos])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await excluirAlimento(idParaExcluir)
    } catch {}
    setIdParaExcluir(null)
    carregarAlimentos()
  }, [idParaExcluir, carregarAlimentos])

  return {
    alimentos,
    categorias,
    carregando,
    filtroNome,
    setFiltroNome,
    filtroCategoriaId,
    setFiltroCategoriaId,
    idParaExcluir,
    setIdParaExcluir,
    carregarAlimentos,
    carregarCategorias,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  }
}
