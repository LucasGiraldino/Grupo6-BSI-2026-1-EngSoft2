import { useState, useCallback } from 'react'
import type { Paciente } from '../../../types'
import { consultarCpf, consultarCep, criarPaciente, atualizarPaciente } from '../../../services/pacienteService'
import { validarCpf, limparCpf } from '../../../utils/cpf'
import { limparTelefone, limparCep, validarTelefone } from '../../../utils/validators'

export interface PacienteFormState {
  id: string
  nome: string
  cpf: string
  dataNascimento: string
  sexo: string
  telefone: string
  email: string
  restricoesAlimentares: string
  enderecoCep: string
  enderecoLogradouro: string
  enderecoNumero: string
  enderecoComplemento: string
  enderecoBairro: string
  enderecoCidade: string
  enderecoEstado: string
  enderecoPais: string
}

const FORM_VAZIO: PacienteFormState = {
  id: '',
  nome: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  email: '',
  restricoesAlimentares: '',
  enderecoCep: '',
  enderecoLogradouro: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoEstado: '',
  enderecoPais: 'Brasil',
}

export function usePacienteForm(
  carregarPacientes: (nome?: string, cpf?: string) => Promise<void>,
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
) {
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<PacienteFormState>(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')
  const [errosCampos, setErrosCampos] = useState<Record<string, string>>({})
  const [buscandoCpf, setBuscandoCpf] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)

  function temErro(campo: string): string {
    return errosCampos[campo] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#030213]'
  }

  function limparErro(campo: string) {
    setErrosCampos(e => { const n = { ...e }; delete n[campo]; return n })
  }

  const buscarDadosPorCpf = useCallback(async (cpf: string) => {
    if (cpf.length !== 11) return
    setBuscandoCpf(true)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const data = await consultarCpf(cpf, controller.signal)
      clearTimeout(timeout)
      if (data.valido) {
        mostrarToast('CPF válido!', 'sucesso')
      } else {
        mostrarToast(data.mensagem || 'CPF inválido. Verifique os dígitos.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CPF. Verifique se o servidor está rodando.', 'erro')
    } finally {
      setBuscandoCpf(false)
    }
  }, [mostrarToast])

  const buscarDadosPorCep = useCallback(async (cep: string) => {
    if (cep.length !== 8) return
    setBuscandoCep(true)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)
      const data = await consultarCep(cep, controller.signal)
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
    setForm(FORM_VAZIO)
    setErroForm('')
    setErrosCampos({})
    setModalAberto(true)
  }, [])

  const abrirModalEdicao = useCallback((p: Paciente) => {
    setForm({
      id: String(p.id),
      nome: p.nome,
      cpf: p.cpf,
      dataNascimento: p.dataNascimento,
      sexo: p.sexo,
      telefone: p.telefone ?? '',
      email: p.email ?? '',
      restricoesAlimentares: p.restricoesAlimentares ?? '',
      enderecoCep: p.endereco?.cep ?? '',
      enderecoLogradouro: p.endereco?.logradouro ?? '',
      enderecoNumero: p.endereco?.numero ?? '',
      enderecoComplemento: p.endereco?.complemento ?? '',
      enderecoBairro: p.endereco?.bairro ?? '',
      enderecoCidade: p.endereco?.cidade ?? '',
      enderecoEstado: p.endereco?.estado ?? '',
      enderecoPais: p.endereco?.pais ?? 'Brasil',
    })
    setErroForm('')
    setErrosCampos({})
    setModalAberto(true)
  }, [])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const campos: Record<string, string> = {
      nome: 'Nome',
      cpf: 'CPF',
      dataNascimento: 'Data de Nascimento',
      sexo: 'Sexo',
      telefone: 'Telefone',
      email: 'E-mail',
      restricoesAlimentares: 'Restrições Alimentares',
      enderecoCep: 'CEP',
      enderecoLogradouro: 'Logradouro',
      enderecoNumero: 'Número',
      enderecoBairro: 'Bairro',
      enderecoCidade: 'Cidade',
      enderecoEstado: 'Estado',
      enderecoPais: 'País',
    }

    const erros: Record<string, string> = {}
    for (const [chave, rotulo] of Object.entries(campos)) {
      const valor = form[chave as keyof typeof form]
      if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
        erros[chave] = `${rotulo} é obrigatório.`
      }
    }

    if (form.cpf && !validarCpf(form.cpf)) {
      erros.cpf = 'CPF inválido. Verifique os dígitos.'
    }

    if (form.telefone && !validarTelefone(form.telefone)) {
      erros.telefone = 'Telefone inválido. Deve ter 10 ou 11 dígitos.'
    }

    if (Object.keys(erros).length > 0) {
      setErrosCampos(erros)
      setErroForm('Preencha todos os campos obrigatórios corretamente.')
      return
    }
    setErrosCampos({})

    const body = {
      nome: form.nome,
      cpf: limparCpf(form.cpf),
      dataNascimento: form.dataNascimento,
      sexo: form.sexo,
      telefone: limparTelefone(form.telefone) || null,
      email: form.email || null,
      restricoesAlimentares: form.restricoesAlimentares || null,
      endereco: {
        cep: limparCep(form.enderecoCep),
        logradouro: form.enderecoLogradouro,
        numero: form.enderecoNumero,
        complemento: form.enderecoComplemento || null,
        bairro: form.enderecoBairro,
        cidade: form.enderecoCidade,
        estado: form.enderecoEstado,
        pais: form.enderecoPais,
      },
    }

    try {
      if (form.id) {
        await atualizarPaciente(parseInt(form.id), body)
        mostrarToast('Paciente atualizado com sucesso!', 'sucesso')
      } else {
        await criarPaciente(body)
        mostrarToast('Paciente cadastrado com sucesso!', 'sucesso')
      }
      setModalAberto(false)
      carregarPacientes()
    } catch {
      setErroForm('Erro ao salvar paciente. Verifique os dados e tente novamente.')
    }
  }, [form, carregarPacientes, mostrarToast])

  const fecharModal = useCallback(() => setModalAberto(false), [])

  return {
    modalAberto,
    form,
    setForm,
    erroForm,
    buscandoCpf,
    buscandoCep,
    temErro,
    limparErro,
    buscarDadosPorCpf,
    buscarDadosPorCep,
    abrirModalNovo,
    abrirModalEdicao,
    salvar,
    fecharModal,
  }
}
