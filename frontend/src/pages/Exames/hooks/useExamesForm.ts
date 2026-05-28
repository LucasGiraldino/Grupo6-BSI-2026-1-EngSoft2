import { useState, useRef, useCallback } from 'react'
import { Exame } from './useExamesData'
import { buscarProntuariosExame, salvarExame } from '../../../services/exameService'
import { formatarCpf } from '../../../utils/cpf'

export interface ExameFormState {
  id: string
  prontuarioId: string
  prontuarioLabel: string
  medicoId: string
  tipoExameId: string
  justificativaClinica: string
  status: string
  observacoesMedico: string
  dataRealizacao: string
}

const FORM_VAZIO: ExameFormState = {
  id: '',
  prontuarioId: '',
  prontuarioLabel: '',
  medicoId: '',
  tipoExameId: '',
  justificativaClinica: '',
  status: 'SOLICITADO',
  observacoesMedico: '',
  dataRealizacao: '',
}

export function useExamesForm(
  carregarDados: (status?: string, tipoExameNome?: string) => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<ExameFormState>(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [prontuarioSearch, setProntuarioSearch] = useState('')
  const [prontuarioResults, setProntuarioResults] = useState<{ id: number; paciente?: { nome: string; cpf?: string }; dataAbertura?: string }[]>([])
  const [searchingProntuario, setSearchingProntuario] = useState(false)
  const [showProntuarioDropdown, setShowProntuarioDropdown] = useState(false)

  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  const buscarProntuarios = useCallback(async (termo: string) => {
    if (!termo.trim()) {
      setProntuarioResults([])
      setShowProntuarioDropdown(false)
      return
    }
    setSearchingProntuario(true)
    try {
      const data = await buscarProntuariosExame(termo)
      setProntuarioResults(data)
      setShowProntuarioDropdown(data.length > 0)
    } catch {
      setProntuarioResults([])
    }
    setSearchingProntuario(false)
  }, [])

  const onProntuarioInputChange = useCallback((value: string) => {
    setProntuarioSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => buscarProntuarios(value), 300)
  }, [buscarProntuarios])

  const selecionarProntuario = useCallback((p: { id: number; paciente?: { nome: string; cpf?: string } }) => {
    const label = `${p.paciente?.nome}${p.paciente?.cpf ? ` (${formatarCpf(p.paciente.cpf)})` : ''}`
    setForm(f => ({ ...f, prontuarioId: String(p.id), prontuarioLabel: label }))
    setProntuarioSearch(`${p.paciente?.nome}${p.paciente?.cpf ? ` - ${formatarCpf(p.paciente.cpf)}` : ''}`)
    setShowProntuarioDropdown(false)
  }, [])

  const limparProntuario = useCallback(() => {
    setForm(f => ({ ...f, prontuarioId: '', prontuarioLabel: '' }))
    setProntuarioSearch('')
    setProntuarioResults([])
  }, [])

  const abrirModalNovo = useCallback(() => {
    setForm(FORM_VAZIO)
    setProntuarioSearch('')
    setProntuarioResults([])
    setErroForm('')
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((e: Exame) => {
    const pacienteNome = e.prontuario?.paciente?.nome ?? ''
    const pacienteCpf = e.prontuario?.paciente?.cpf ?? ''
    setForm({
      id: String(e.id),
      prontuarioId: String(e.prontuario?.id ?? ''),
      prontuarioLabel: pacienteNome + (pacienteCpf ? ` (${pacienteCpf})` : ''),
      medicoId: String(e.medico?.id ?? ''),
      tipoExameId: String(e.tipoExame?.id ?? ''),
      justificativaClinica: e.justificativaClinica,
      status: e.status,
      observacoesMedico: e.observacoesMedico ?? '',
      dataRealizacao: e.dataRealizacao ?? '',
    })
    setProntuarioSearch(pacienteNome + (pacienteCpf ? ` - ${pacienteCpf}` : ''))
    setErroForm('')
    setModalAberto(true)
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.prontuarioId || !form.medicoId || !form.tipoExameId || !form.justificativaClinica) {
      setErroForm('Preencha todos os campos obrigatórios.')
      return
    }

    if (form.dataRealizacao) {
      const hoje = new Date().toISOString().split('T')[0]
      if (form.dataRealizacao < hoje) {
        setErroForm('A data de realização não pode ser anterior à data atual.')
        return
      }
    }

    const body = {
      prontuario: { id: parseInt(form.prontuarioId) },
      medico: { id: parseInt(form.medicoId) },
      tipoExame: { id: parseInt(form.tipoExameId) },
      justificativaClinica: form.justificativaClinica,
      status: form.status,
      observacoesMedico: form.observacoesMedico || null,
      dataRealizacao: form.dataRealizacao || null,
    }

    try {
      await salvarExame(form.id || undefined, body)
      setModalAberto(false)
      mostrarToast(form.id ? 'Exame atualizado com sucesso!' : 'Exame cadastrado com sucesso!', 'sucesso')
      carregarDados()
    } catch {
      setErroForm('Erro ao salvar exame. Verifique os dados e tente novamente.')
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
    onProntuarioInputChange,
    selecionarProntuario,
    limparProntuario,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  }
}
