import { useState, useCallback } from 'react'
import { Usuario } from './useUsuariosData'
import { criarUsuario, atualizarUsuario, consultarCepUsuario } from '../../../services/usuarioService'
import { validarCpf, limparCpf } from '../../../utils/cpf'
import { validarEmail, limparTelefone, limparCep } from '../../../utils/validators'

export interface UsuarioFormState {
  nome: string
  email: string
  cpf: string
  senha: string
  perfil: string
  dataNascimento: string
  telefone: string
  enderecoCep: string
  enderecoLogradouro: string
  enderecoNumero: string
  enderecoComplemento: string
  enderecoBairro: string
  enderecoCidade: string
  enderecoEstado: string
  enderecoPais: string
}

const FORM_VAZIO: UsuarioFormState = {
  nome: '',
  email: '',
  cpf: '',
  senha: '',
  perfil: 'USUARIO',
  dataNascimento: '',
  telefone: '',
  enderecoCep: '',
  enderecoLogradouro: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoEstado: '',
  enderecoPais: 'Brasil',
}

interface ErroForm {
  campo?: string
  mensagem: string
}

export function useUsuariosForm(
  carregarUsuarios: (search?: string, perfil?: string) => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [form, setForm] = useState<UsuarioFormState>(FORM_VAZIO)
  const [erroForm, setErroForm] = useState<ErroForm | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)

  const buscarDadosPorCep = useCallback(async (cep: string) => {
    if (cep.length !== 8) return
    setBuscandoCep(true)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const data = await consultarCepUsuario(cep, controller.signal)
      clearTimeout(timeout)
      if (data.valido) {
        setForm(f => ({
          ...f,
          enderecoLogradouro: data.logradouro ?? f.enderecoLogradouro,
          enderecoBairro: data.bairro ?? f.enderecoBairro,
          enderecoCidade: data.localidade ?? f.enderecoCidade,
          enderecoEstado: data.uf ?? f.enderecoEstado,
          enderecoComplemento: data.complemento ?? f.enderecoComplemento,
        }))
        mostrarToast('Endereço encontrado para o CEP informado!', 'sucesso')
      } else {
        mostrarToast(data.mensagem || 'CEP não encontrado.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CEP.', 'erro')
    } finally {
      setBuscandoCep(false)
    }
  }, [mostrarToast])

  const abrirModalNovo = useCallback(() => {
    setEditandoId(null)
    setForm({ ...FORM_VAZIO })
    setErroForm(null)
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((usuario: Usuario) => {
    setEditandoId(usuario.id)
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      senha: '',
      perfil: usuario.perfil === 'ADMINISTRADOR' ? 'ADMIN' : usuario.perfil,
      dataNascimento: usuario.dataNascimento ?? '',
      telefone: usuario.telefone ?? '',
      enderecoCep: usuario.endereco?.cep ?? '',
      enderecoLogradouro: usuario.endereco?.logradouro ?? '',
      enderecoNumero: usuario.endereco?.numero ?? '',
      enderecoComplemento: usuario.endereco?.complemento ?? '',
      enderecoBairro: usuario.endereco?.bairro ?? '',
      enderecoCidade: usuario.endereco?.cidade ?? '',
      enderecoEstado: usuario.endereco?.estado ?? '',
      enderecoPais: usuario.endereco?.pais ?? 'Brasil',
    })
    setErroForm(null)
    setModalAberto(true)
  }, [])

  const validarForm = useCallback((): boolean => {
    if (!form.nome.trim()) {
      setErroForm({ campo: 'nome', mensagem: 'Nome é obrigatório' })
      return false
    }
    if (!form.email.trim()) {
      setErroForm({ campo: 'email', mensagem: 'Email é obrigatório' })
      return false
    }
    if (!validarEmail(form.email)) {
      setErroForm({ campo: 'email', mensagem: 'Email inválido' })
      return false
    }
    if (limparCpf(form.cpf).length !== 11) {
      setErroForm({ campo: 'cpf', mensagem: 'CPF deve ter 11 dígitos' })
      return false
    }
    if (!validarCpf(form.cpf)) {
      setErroForm({ campo: 'cpf', mensagem: 'CPF inválido. Verifique os dígitos.' })
      return false
    }
    if (!editandoId && form.senha.length < 6) {
      setErroForm({ campo: 'senha', mensagem: 'Senha deve ter no mínimo 6 caracteres' })
      return false
    }
    if (editandoId && form.senha.length > 0 && form.senha.length < 6) {
      setErroForm({ campo: 'senha', mensagem: 'Senha deve ter no mínimo 6 caracteres' })
      return false
    }
    return true
  }, [form, editandoId])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarForm()) return

    setSalvando(true)
    try {
      const payload = {
        nome: form.nome.trim(),
        email: form.email.trim(),
        cpf: limparCpf(form.cpf),
        perfil: form.perfil,
        dataNascimento: form.dataNascimento,
        telefone: limparTelefone(form.telefone),
        enderecoCep: limparCep(form.enderecoCep),
        enderecoLogradouro: form.enderecoLogradouro,
        enderecoNumero: form.enderecoNumero,
        enderecoComplemento: form.enderecoComplemento,
        enderecoBairro: form.enderecoBairro,
        enderecoCidade: form.enderecoCidade,
        enderecoEstado: form.enderecoEstado,
        enderecoPais: form.enderecoPais,
        senha: form.senha || undefined,
      }

      if (editandoId) {
        await atualizarUsuario(editandoId, payload)
        mostrarToast('Usuário atualizado com sucesso!', 'sucesso')
      } else {
        await criarUsuario(payload)
        mostrarToast('Usuário criado com sucesso!', 'sucesso')
      }
      setEditandoId(null)
      setModalAberto(false)
      carregarUsuarios()
    } catch (err: any) {
      const msg = err.response?.data?.error || (editandoId ? 'Erro ao atualizar usuário' : 'Erro ao criar usuário')
      setErroForm({ mensagem: msg })
    } finally {
      setSalvando(false)
    }
  }, [form, editandoId, validarForm, carregarUsuarios, mostrarToast])

  const fecharModal = useCallback(() => {
    setModalAberto(false)
    setEditandoId(null)
  }, [])

  return {
    modalAberto,
    editandoId,
    setEditandoId,
    form,
    setForm,
    erroForm,
    salvando,
    buscandoCep,
    buscarDadosPorCep,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  }
}
