import { useState, useRef, useCallback } from 'react'
import type { Triagem, Prontuario } from '../../../types'
import { buscarProntuarios, salvarTriagem } from '../../../services/triagemService'
import { formatarCpf } from '../../../utils/cpf'

export interface TriagemFormState {
  id: string
  prontuarioId: string
  prontuarioLabel: string
  medicoId: string
  pressaoArterial: string
  febre: string
  condicaoClinica: string
  condicaoNutricional: string
  condicaoSocial: string
  observacoes: string
}

const FORM_VAZIO: TriagemFormState = {
  id: '',
  prontuarioId: '',
  prontuarioLabel: '',
  medicoId: '',
  pressaoArterial: '',
  febre: '',
  condicaoClinica: '',
  condicaoNutricional: '',
  condicaoSocial: '',
  observacoes: '',
}

export function useTriagemForm(
  carregarDados: (pacienteNome?: string, medicoId?: string) => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<TriagemFormState>(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [prontuarioSearch, setProntuarioSearch] = useState('')
  const [prontuarioResults, setProntuarioResults] = useState<Prontuario[]>([])
  const [searchingProntuario, setSearchingProntuario] = useState(false)
  const [showProntuarioDropdown, setShowProntuarioDropdown] = useState(false)
  const [searchEmpty, setSearchEmpty] = useState(false)

  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  const buscarProntuariosFn = useCallback(async (termo: string) => {
    if (!termo.trim()) {
      setProntuarioResults([])
      setShowProntuarioDropdown(false)
      setSearchEmpty(false)
      return
    }
    setSearchingProntuario(true)
    try {
      const data = await buscarProntuarios(termo)
      setProntuarioResults(data)
      setShowProntuarioDropdown(data.length > 0)
      setSearchEmpty(data.length === 0)
    } catch {
      setProntuarioResults([])
      setSearchEmpty(false)
    }
    setSearchingProntuario(false)
  }, [])

  const onProntuarioInputChange = useCallback((value: string) => {
    setProntuarioSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => buscarProntuariosFn(value), 300)
  }, [buscarProntuariosFn])

  const selecionarProntuario = useCallback((p: Prontuario) => {
    const label = `${p.paciente?.nome}${p.paciente?.cpf ? ` (${formatarCpf(p.paciente.cpf)})` : ''}`
    setForm(f => ({ ...f, prontuarioId: String(p.id), prontuarioLabel: label }))
    setProntuarioSearch(`${p.paciente?.nome}${p.paciente?.cpf ? ` - ${formatarCpf(p.paciente.cpf)}` : ''}`)
    setShowProntuarioDropdown(false)
    setSearchEmpty(false)
  }, [])

  const limparProntuario = useCallback(() => {
    setForm(f => ({ ...f, prontuarioId: '', prontuarioLabel: '' }))
    setProntuarioSearch('')
    setProntuarioResults([])
    setSearchEmpty(false)
  }, [])

  const abrirModalNovo = useCallback(() => {
    setForm(FORM_VAZIO)
    setProntuarioSearch('')
    setProntuarioResults([])
    setErroForm('')
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((t: Triagem) => {
    const pacienteNome = t.prontuario?.paciente?.nome ?? ''
    const pacienteCpf = t.prontuario?.paciente?.cpf ?? ''
    setForm({
      id: String(t.id),
      prontuarioId: String(t.prontuario?.id ?? ''),
      prontuarioLabel: pacienteNome + (pacienteCpf ? ` (${pacienteCpf})` : ''),
      medicoId: String(t.medico?.id ?? ''),
      pressaoArterial: t.pressaoArterial ?? '',
      febre: t.febre != null ? String(t.febre) : '',
      condicaoClinica: t.condicaoClinica,
      condicaoNutricional: t.condicaoNutricional ?? '',
      condicaoSocial: t.condicaoSocial ?? '',
      observacoes: t.observacoes ?? '',
    })
    setProntuarioSearch(pacienteNome + (pacienteCpf ? ` - ${pacienteCpf}` : ''))
    setErroForm('')
    setModalAberto(true)
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.prontuarioId || !form.medicoId || !form.condicaoClinica) {
      setErroForm('Preencha todos os campos obrigatórios.')
      return
    }

    if (form.febre) {
      const valor = parseFloat(form.febre)
      if (isNaN(valor) || valor < 34 || valor > 45) {
        setErroForm('Febre deve estar entre 34°C e 45°C.')
        return
      }
    }

    if (form.pressaoArterial && !/^\d{2,3}x\d{2,3}$/.test(form.pressaoArterial)) {
      setErroForm('Pressão arterial deve estar no formato "120x80" (sistólica x diastólica).')
      return
    }

    const body = {
      prontuario: { id: parseInt(form.prontuarioId) },
      medico: { id: parseInt(form.medicoId) },
      condicaoClinica: form.condicaoClinica,
      pressaoArterial: form.pressaoArterial || null,
      febre: form.febre ? parseFloat(form.febre) : null,
      condicaoNutricional: form.condicaoNutricional || null,
      condicaoSocial: form.condicaoSocial || null,
      observacoes: form.observacoes || null,
    }

    try {
      await salvarTriagem(form.id, body)
      setModalAberto(false)
      mostrarToast(form.id ? 'Triagem atualizada com sucesso!' : 'Triagem cadastrada com sucesso!', 'sucesso')
      carregarDados()
    } catch {
      setErroForm('Erro ao salvar triagem. Verifique os dados e tente novamente.')
    }
  }, [form, carregarDados, mostrarToast])

  const fecharModal = useCallback(() => setModalAberto(false), [])

  return {
    modalAberto,
    form,
    setForm,
    erroForm,
    prontuarioSearch,
    prontuarioResults,
    searchingProntuario,
    showProntuarioDropdown,
    setShowProntuarioDropdown,
    searchEmpty,
    onProntuarioInputChange,
    selecionarProntuario,
    limparProntuario,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  }
}
