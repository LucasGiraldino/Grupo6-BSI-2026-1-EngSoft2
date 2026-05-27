import { useState, useCallback, useEffect } from 'react'
import { listarProfissionais, desativarProfissional } from '../../../services/profissionalService'
import type { Profissional } from '../../../types'
export type { Profissional }

export function useProfissionaisData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroNome, setFiltroNome] = useState('')
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregar = useCallback(async (nome?: string, especialidade?: string) => {
    setCarregando(true)
    try {
      const data = await listarProfissionais(nome, especialidade)
      setProfissionais(data)
    } catch {
      mostrarToast('Erro ao carregar profissionais', 'erro')
    }
    setCarregando(false)
  }, [mostrarToast])

  useEffect(() => { carregar() }, [carregar])

  const handleBuscar = useCallback(() => {
    carregar(filtroNome, filtroEspecialidade)
  }, [carregar, filtroNome, filtroEspecialidade])

  const handleLimparFiltros = useCallback(() => {
    setFiltroNome('')
    setFiltroEspecialidade('')
    carregar()
  }, [carregar])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await desativarProfissional(idParaExcluir)
      mostrarToast('Profissional desativado com sucesso!', 'sucesso')
    } catch {
      mostrarToast('Erro ao desativar profissional', 'erro')
    }
    setIdParaExcluir(null)
    carregar()
  }, [idParaExcluir, carregar, mostrarToast])

  return {
    profissionais,
    carregando,
    filtroNome,
    setFiltroNome,
    filtroEspecialidade,
    setFiltroEspecialidade,
    idParaExcluir,
    setIdParaExcluir,
    carregar,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  }
}
