import { useState, useCallback, useEffect } from 'react'
import { Receita } from './useReceitasData'
import { listarProntuarios, listarMedicos, salvarReceita } from '../../../services/receitaService'
import type { Prontuario, Medico } from '../../../types'

export interface ReceitaFormState {
  id: string
  dataEmissao: string
  descricao: string
  dataValidade: string
}

const FORM_VAZIO: ReceitaFormState = { id: '', dataEmissao: '', descricao: '', dataValidade: '' }

export function useReceitasForm(
  carregarReceitas: () => Promise<void>,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<ReceitaFormState>(FORM_VAZIO)
  const [prontuarioId, setProntuarioId] = useState('')
  const [medicoId, setMedicoId] = useState('')
  const [erroForm, setErroForm] = useState('')
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])

  const carregarProntuarios = useCallback(async () => {
    try {
      const data = await listarProntuarios()
      setProntuarios(data)
    } catch {}
  }, [])

  const carregarMedicos = useCallback(async () => {
    try {
      const data = await listarMedicos()
      setMedicos(data)
    } catch {}
  }, [])

  useEffect(() => {
    carregarProntuarios()
    carregarMedicos()
  }, [carregarProntuarios, carregarMedicos])

  const abrirModalNovo = useCallback(() => {
    setForm(FORM_VAZIO)
    setProntuarioId('')
    setMedicoId('')
    setErroForm('')
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((r: Receita) => {
    setForm({
      id: String(r.id),
      dataEmissao: r.dataEmissao ? r.dataEmissao.substring(0, 16) : '',
      descricao: r.descricao ?? '',
      dataValidade: r.dataValidade ?? '',
    })
    setProntuarioId('')
    setMedicoId('')
    setErroForm('')
    setModalAberto(true)
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prontuarioId || !medicoId) {
      setErroForm('Selecione o prontuário e o médico.')
      return
    }
    const body = {
      dataEmissao: form.dataEmissao ? new Date(form.dataEmissao).toISOString() : null,
      descricao: form.descricao || null,
      dataValidade: form.dataValidade || null,
      prontuario: { id: parseInt(prontuarioId) },
      medico: { id: parseInt(medicoId) },
    }
    try {
      await salvarReceita(form.id || undefined, body)
      setModalAberto(false)
      carregarReceitas()
    } catch (err: any) {
      const data = err.response?.data
      setErroForm(typeof data === 'string' ? data : data?.error || 'Erro ao salvar receita. Verifique os dados e tente novamente.')
    }
  }, [form, prontuarioId, medicoId, carregarReceitas])

  const fecharModal = useCallback(() => setModalAberto(false), [])

  return {
    modalAberto,
    form,
    setForm,
    prontuarioId,
    setProntuarioId,
    medicoId,
    setMedicoId,
    erroForm,
    prontuarios,
    medicos,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  }
}
