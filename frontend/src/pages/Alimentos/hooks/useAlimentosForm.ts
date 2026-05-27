import { useState, useCallback } from 'react'
import { Alimento } from './useAlimentosData'
import { salvarAlimento, criarCategoria, excluirCategoria } from '../../../services/alimentoService'

export interface AlimentoFormState {
  id: string
  nome: string
  descricao: string
  categoriaId: string
  unidadeMedida: string
  dataVencimento: string
}

const FORM_VAZIO: AlimentoFormState = { id: '', nome: '', descricao: '', categoriaId: '', unidadeMedida: '', dataVencimento: '' }

export function useAlimentosForm(
  carregarAlimentos: (nome?: string, categoriaId?: string) => Promise<void>,
  carregarCategorias: () => Promise<void>,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<AlimentoFormState>(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [modalCatAberto, setModalCatAberto] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')

  const abrirModalNovo = useCallback(() => {
    setForm(FORM_VAZIO)
    setErroForm('')
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((a: Alimento) => {
    setForm({
      id: String(a.id),
      nome: a.nome,
      descricao: a.descricao ?? '',
      categoriaId: String(a.categoria?.id ?? ''),
      unidadeMedida: a.unidadeMedida ?? '',
      dataVencimento: a.dataVencimento ?? '',
    })
    setErroForm('')
    setModalAberto(true)
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      nome: form.nome,
      descricao: form.descricao,
      unidadeMedida: form.unidadeMedida.toUpperCase(),
      dataVencimento: form.dataVencimento || null,
      categoria: { id: parseInt(form.categoriaId) },
    }
    try {
      await salvarAlimento(form.id || undefined, body)
      setModalAberto(false)
      carregarAlimentos()
    } catch {
      setErroForm('Erro ao salvar alimento. Verifique os dados e tente novamente.')
    }
  }, [form, carregarAlimentos])

  const fecharModal = useCallback(() => setModalAberto(false), [])

  const abrirModalCategoria = useCallback(() => setModalCatAberto(true), [])

  const fecharModalCategoria = useCallback(() => setModalCatAberto(false), [])

  const criarNovaCategoria = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    const nome = novaCategoria.trim()
    if (!nome) return
    await criarCategoria(nome)
    setNovaCategoria('')
    carregarCategorias()
  }, [novaCategoria, carregarCategorias])

  const excluirCategoriaAction = useCallback(async (id: number) => {
    await excluirCategoria(id)
    carregarCategorias()
  }, [carregarCategorias])

  return {
    modalAberto,
    form,
    setForm,
    erroForm,
    modalCatAberto,
    novaCategoria,
    setNovaCategoria,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
    abrirModalCategoria,
    fecharModalCategoria,
    criarNovaCategoria,
    excluirCategoriaAction,
  }
}
