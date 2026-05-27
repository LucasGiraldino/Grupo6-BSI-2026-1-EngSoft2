import { useState, useCallback, useEffect } from 'react'
import { listarUsuarios, desativarUsuario } from '../../../services/usuarioService'
import type { Usuario } from '../../../types'
export type { Usuario }

export function useUsuariosData(mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(false)
  const [filtroSearch, setFiltroSearch] = useState('')
  const [filtroPerfil, setFiltroPerfil] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const carregarUsuarios = useCallback(async (search?: string, perfil?: string) => {
    setCarregando(true)
    try {
      const data = await listarUsuarios(search, perfil)
      setUsuarios(data)
    } catch {
      mostrarToast('Erro ao carregar usuários', 'erro')
    }
    setCarregando(false)
  }, [mostrarToast])

  useEffect(() => { carregarUsuarios() }, [carregarUsuarios])

  const handleBuscar = useCallback(() => {
    carregarUsuarios(filtroSearch, filtroPerfil)
  }, [carregarUsuarios, filtroSearch, filtroPerfil])

  const handleLimparFiltros = useCallback(() => {
    setFiltroSearch('')
    setFiltroPerfil('')
    carregarUsuarios()
  }, [carregarUsuarios])

  const confirmarDelete = useCallback(async () => {
    if (idParaExcluir === null) return
    try {
      await desativarUsuario(idParaExcluir)
      setUsuarios(prev => prev.map(u => u.id === idParaExcluir ? { ...u, ativo: false } : u))
      mostrarToast('Usuário desativado com sucesso', 'sucesso')
    } catch {
      mostrarToast('Erro ao desativar usuário', 'erro')
    }
    setIdParaExcluir(null)
  }, [idParaExcluir, mostrarToast])

  return {
    usuarios,
    carregando,
    filtroSearch,
    setFiltroSearch,
    filtroPerfil,
    setFiltroPerfil,
    idParaExcluir,
    setIdParaExcluir,
    carregarUsuarios,
    handleBuscar,
    handleLimparFiltros,
    confirmarDelete,
  }
}
