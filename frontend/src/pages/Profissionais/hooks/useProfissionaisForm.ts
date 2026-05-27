import { useState, useCallback, useEffect } from 'react'
import type { Profissional } from '../../../types'
import { listarUsuarios, criarProfissional, atualizarProfissional } from '../../../services/profissionalService'

interface UsuarioItem {
  id: number
  nome: string
  email: string
  cpf: string
}

export interface ProfissionalFormState {
  id: string
  usuarioId: string
  especialidade: string
  registroProfissional: string
  dataAdmissao: string
  ehMedico: boolean
}

const FORM_VAZIO: ProfissionalFormState = {
  id: '',
  usuarioId: '',
  especialidade: '',
  registroProfissional: '',
  dataAdmissao: '',
  ehMedico: false,
}

export function useProfissionaisForm(
  carregarProfissionais: (nome?: string, especialidade?: string) => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<ProfissionalFormState>(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [usuarios, setUsuarios] = useState<UsuarioItem[]>([])

  const carregarUsuarios = useCallback(async () => {
    try {
      const data = await listarUsuarios()
      setUsuarios(data)
    } catch {
      mostrarToast('Erro ao carregar usuários', 'erro')
    }
  }, [mostrarToast])

  useEffect(() => { carregarUsuarios() }, [carregarUsuarios])

  const abrirModalNovo = useCallback(() => {
    setForm(FORM_VAZIO)
    setErroForm('')
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((p: Profissional) => {
    setForm({
      id: String(p.id),
      usuarioId: String(p.usuario.id),
      especialidade: p.especialidade,
      registroProfissional: p.registroProfissional,
      dataAdmissao: p.dataAdmissao,
      ehMedico: false,
    })
    setErroForm('')
    setModalAberto(true)
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.usuarioId) { setErroForm('Selecione um usuário.'); return }
    if (!form.especialidade.trim()) { setErroForm('Especialidade é obrigatória.'); return }
    if (!form.registroProfissional.trim()) { setErroForm('Registro profissional é obrigatório.'); return }
    if (!form.dataAdmissao) { setErroForm('Data de admissão é obrigatória.'); return }

    const body = {
      usuario: { id: Number(form.usuarioId) },
      especialidade: form.especialidade.trim(),
      registroProfissional: form.registroProfissional.trim(),
      dataAdmissao: form.dataAdmissao,
      ehMedico: form.ehMedico,
    }

    try {
      if (form.id) {
        await atualizarProfissional(Number(form.id), body)
        mostrarToast('Profissional atualizado com sucesso!', 'sucesso')
      } else {
        await criarProfissional(body)
        mostrarToast('Profissional cadastrado com sucesso!', 'sucesso')
      }
      setModalAberto(false)
      carregarProfissionais()
    } catch (err: any) {
      if (err.response?.status === 409) {
        setErroForm('Este usuário já possui um profissional vinculado.')
      } else {
        setErroForm('Erro ao salvar profissional. Verifique os dados e tente novamente.')
      }
    }
  }, [form, carregarProfissionais, mostrarToast])

  const fecharModal = useCallback(() => setModalAberto(false), [])

  return {
    modalAberto,
    form,
    setForm,
    erroForm,
    usuarios,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  }
}
