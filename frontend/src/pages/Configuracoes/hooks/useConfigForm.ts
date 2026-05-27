import { useState, useCallback, useEffect } from 'react'
import { carregarConfiguracao, salvarConfiguracao, consultarCnpj, consultarCepConfig } from '../../../services/configuracaoService'
import { limparCnpj, validarCnpj, validarTelefone, validarEmail } from '../../../utils/validators'

export interface ConfigFormState {
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  telefone: string
  email: string
  site: string
  dataFundacao: string
  logoUrl: string
  observacoes: string
  enderecoCep: string
  enderecoLogradouro: string
  enderecoNumero: string
  enderecoComplemento: string
  enderecoBairro: string
  enderecoCidade: string
  enderecoEstado: string
}

const FORM_VAZIO: ConfigFormState = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  telefone: '',
  email: '',
  site: '',
  dataFundacao: '',
  logoUrl: '',
  observacoes: '',
  enderecoCep: '',
  enderecoLogradouro: '',
  enderecoNumero: '',
  enderecoComplemento: '',
  enderecoBairro: '',
  enderecoCidade: '',
  enderecoEstado: '',
}

export function useConfigForm(
  mostrarToast: (msg: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info') => void,
  onSalvo?: () => void,
) {
  const [form, setForm] = useState<ConfigFormState>(FORM_VAZIO)
  const [configId, setConfigId] = useState<number | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [buscandoCnpj, setBuscandoCnpj] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)

  const carregar = useCallback(async () => {
    setCarregando(true)
    try {
      const data = await carregarConfiguracao()
      setConfigId(data.id)
      setForm({
        razaoSocial: data.razaoSocial || '',
        nomeFantasia: data.nomeFantasia || '',
        cnpj: data.cnpj || '',
        telefone: data.telefone || '',
        email: data.email || '',
        site: data.site || '',
        dataFundacao: data.dataFundacao || '',
        logoUrl: data.logoUrl || '',
        observacoes: data.observacoes || '',
        enderecoCep: data.endereco?.cep || '',
        enderecoLogradouro: data.endereco?.logradouro || '',
        enderecoNumero: data.endereco?.numero || '',
        enderecoComplemento: data.endereco?.complemento || '',
        enderecoBairro: data.endereco?.bairro || '',
        enderecoCidade: data.endereco?.cidade || '',
        enderecoEstado: data.endereco?.estado || '',
      })
    } catch {
      mostrarToast('Erro ao carregar configurações. Verifique se o servidor está rodando.', 'erro')
    } finally {
      setCarregando(false)
    }
  }, [mostrarToast])

  useEffect(() => { carregar() }, [carregar])

  const buscarCnpj = useCallback(async (cnpjRaw: string) => {
    if (cnpjRaw.length !== 14) return
    setBuscandoCnpj(true)
    try {
      const data = await consultarCnpj(cnpjRaw)
      if (data.valido) {
        const updates: Partial<ConfigFormState> = {}
        if (data.razaoSocial) updates.razaoSocial = data.razaoSocial
        if (data.nomeFantasia) updates.nomeFantasia = data.nomeFantasia
        if (data.logradouro) updates.enderecoLogradouro = data.logradouro
        if (data.numero) updates.enderecoNumero = data.numero
        if (data.complemento) updates.enderecoComplemento = data.complemento
        if (data.bairro) updates.enderecoBairro = data.bairro
        if (data.municipio) updates.enderecoCidade = data.municipio
        if (data.uf) updates.enderecoEstado = data.uf
        if (data.cep) updates.enderecoCep = data.cep
        if (data.telefone) updates.telefone = data.telefone
        if (data.email) updates.email = data.email
        setForm(f => ({ ...f, ...updates }))
        mostrarToast('Dados encontrados para o CNPJ informado!', 'sucesso')
      } else {
        mostrarToast(data.mensagem || 'CNPJ inválido. Verifique os dígitos e tente novamente.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CNPJ. Verifique se o servidor está rodando.', 'erro')
    } finally {
      setBuscandoCnpj(false)
    }
  }, [mostrarToast])

  const buscarCep = useCallback(async (cepRaw: string) => {
    if (cepRaw.length !== 8) return
    setBuscandoCep(true)
    try {
      const data = await consultarCepConfig(cepRaw)
      if (data.valido) {
        setForm(f => ({
          ...f,
          enderecoLogradouro: data.logradouro || f.enderecoLogradouro,
          enderecoComplemento: data.complemento || f.enderecoComplemento,
          enderecoBairro: data.bairro || f.enderecoBairro,
          enderecoCidade: data.localidade || f.enderecoCidade,
          enderecoEstado: data.uf || f.enderecoEstado,
        }))
        mostrarToast('CEP encontrado!', 'sucesso')
      } else {
        mostrarToast(data.mensagem || 'CEP não encontrado.', 'erro')
      }
    } catch {
      mostrarToast('Erro ao consultar CEP. Verifique se o servidor está rodando.', 'erro')
    } finally {
      setBuscandoCep(false)
    }
  }, [mostrarToast])

  const salvar = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.razaoSocial || !limparCnpj(form.cnpj)) {
      mostrarToast('Razão Social e CNPJ são obrigatórios.', 'erro')
      return
    }
    if (!validarCnpj(form.cnpj)) {
      mostrarToast('CNPJ inválido. Verifique os dígitos.', 'erro')
      return
    }
    if (form.telefone && !validarTelefone(form.telefone)) {
      mostrarToast('Telefone inválido. Deve ter 10 ou 11 dígitos.', 'erro')
      return
    }
    if (form.email && !validarEmail(form.email)) {
      mostrarToast('E-mail inválido.', 'erro')
      return
    }

    setSalvando(true)
    const body = {
      razaoSocial: form.razaoSocial,
      nomeFantasia: form.nomeFantasia || null,
      cnpj: limparCnpj(form.cnpj),
      telefone: form.telefone || null,
      email: form.email || null,
      site: form.site || null,
      logoUrl: form.logoUrl || null,
      dataFundacao: form.dataFundacao || null,
      observacoes: form.observacoes || null,
      endereco: {
        cep: form.enderecoCep || null,
        logradouro: form.enderecoLogradouro || null,
        numero: form.enderecoNumero || null,
        complemento: form.enderecoComplemento || null,
        bairro: form.enderecoBairro || null,
        cidade: form.enderecoCidade || null,
        estado: form.enderecoEstado || null,
      },
    }
    try {
      const saved = await salvarConfiguracao(configId, body)
      if (!configId) setConfigId(saved.id)
      onSalvo?.()
      mostrarToast('Configurações salvas com sucesso!', 'sucesso')
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Erro ao salvar configurações. Verifique os dados e tente novamente.'
      mostrarToast(msg, 'erro')
    } finally {
      setSalvando(false)
    }
  }, [form, configId, mostrarToast])

  return {
    form,
    setForm,
    carregando,
    salvando,
    buscandoCnpj,
    buscandoCep,
    buscarCnpj,
    buscarCep,
    salvar,
    recarregar: carregar,
  }
}
