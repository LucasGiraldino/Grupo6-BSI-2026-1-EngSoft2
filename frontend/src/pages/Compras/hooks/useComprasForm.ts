import { useState, useCallback, useEffect } from 'react'
import { Compra } from './useComprasData'
import { listarAlimentosCompra, salvarCompra } from '../../../services/compraService'
import { limparMoeda } from '../../../utils/validators'
import type { Alimento } from '../../../types'

interface ItemCompraForm {
  alimento: { id: number }
  quantidade: string
  preco: string
}

const ITEM_VAZIO: ItemCompraForm = { alimento: { id: 0 }, quantidade: '', preco: '' }

export interface ComprasFormState {
  id: string
  dataCompra: string
  observacoes: string
}

const FORM_VAZIO: ComprasFormState = { id: '', dataCompra: '', observacoes: '' }

export function useComprasForm(
  carregarCompras: (dataInicio?: string, dataFim?: string, observacoes?: string) => Promise<void>,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<ComprasFormState>(FORM_VAZIO)
  const [itens, setItens] = useState<ItemCompraForm[]>([{ ...ITEM_VAZIO }])
  const [erroForm, setErroForm] = useState('')
  const [alimentos, setAlimentos] = useState<Pick<Alimento, 'id' | 'nome' | 'unidadeMedida'>[]>([])

  const carregarAlimentos = useCallback(async () => {
    try {
      const data = await listarAlimentosCompra()
      setAlimentos(data)
    } catch {}
  }, [])

  useEffect(() => { carregarAlimentos() }, [carregarAlimentos])

  const abrirModalNovo = useCallback(() => {
    setForm(FORM_VAZIO)
    setItens([{ ...ITEM_VAZIO }])
    setErroForm('')
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((c: Compra) => {
    setForm({
      id: String(c.id),
      dataCompra: c.dataCompra ? c.dataCompra.substring(0, 16) : '',
      observacoes: c.observacoes ?? '',
    })
    setItens(
      c.itens.length > 0
        ? c.itens.map(i => ({
            alimento: { id: i.alimento.id },
            quantidade: String(i.quantidade),
            preco: String(Math.round(i.preco * 100)),
          }))
        : [{ ...ITEM_VAZIO }]
    )
    setErroForm('')
    setModalAberto(true)
  }, [])

  const atualizarItem = useCallback((index: number, campo: string, valor: string | { id: number }) => {
    setItens(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item))
  }, [])

  const adicionarItem = useCallback(() => {
    setItens(prev => [...prev, { ...ITEM_VAZIO }])
  }, [])

  const removerItem = useCallback((index: number) => {
    setItens(prev => prev.filter((_, i) => i !== index))
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (itens.some(i => !i.alimento.id || !i.quantidade || !i.preco)) {
      setErroForm('Preencha todos os campos dos itens.')
      return
    }

    const body = {
      dataCompra: form.dataCompra ? new Date(form.dataCompra).toISOString() : null,
      observacoes: form.observacoes || null,
      itens: itens.map(i => ({
        alimento: { id: i.alimento.id },
        quantidade: parseFloat(i.quantidade),
        preco: limparMoeda(i.preco),
      })),
    }

    try {
      await salvarCompra(form.id || undefined, body)
      setModalAberto(false)
      carregarCompras()
    } catch {
      setErroForm('Erro ao salvar compra. Verifique os dados e tente novamente.')
    }
  }, [form, itens, carregarCompras])

  const fecharModal = useCallback(() => setModalAberto(false), [])

  return {
    modalAberto,
    form,
    setForm,
    itens,
    erroForm,
    alimentos,
    atualizarItem,
    adicionarItem,
    removerItem,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  }
}
