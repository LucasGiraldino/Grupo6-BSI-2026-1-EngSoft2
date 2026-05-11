import { useEffect, useState, useRef, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Loader, Search, Stethoscope } from 'lucide-react'
import api from '../services/api'

interface Medico {
  id: number
  crm: string
  especialidadeMedica: string
  usuario?: { id?: number; nome: string }
}

interface Paciente {
  id?: number
  nome: string
  cpf?: string
}

interface Prontuario {
  id: number
  paciente?: Paciente
  dataAbertura?: string
}

interface Triagem {
  id: number
  medico: Medico
  prontuario: Prontuario
  dataTriagem: string
  pressaoArterial?: string
  febre?: number
  condicaoClinica: string
  condicaoNutricional?: string
  condicaoSocial?: string
  observacoes?: string
}

const FORM_VAZIO = {
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

export default function TriagemPage() {
  const [triagens, setTriagens] = useState<Triagem[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [carregando, setCarregando] = useState(true)

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')

  const [prontuarioSearch, setProntuarioSearch] = useState('')
  const [prontuarioResults, setProntuarioResults] = useState<Prontuario[]>([])
  const [searchingProntuario, setSearchingProntuario] = useState(false)
  const [showProntuarioDropdown, setShowProntuarioDropdown] = useState(false)
  const prontuarioRef = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  useEffect(() => {
    carregarDados()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (prontuarioRef.current && !prontuarioRef.current.contains(e.target as Node)) {
        setShowProntuarioDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function carregarDados() {
    setCarregando(true)
    try {
      const [triagensRes, medicosRes] = await Promise.all([
        api.get('/api/triagens'),
        api.get('/api/triagens/medicos'),
      ])
      setTriagens(triagensRes.data)
      setMedicos(medicosRes.data)
    } catch {}
    setCarregando(false)
  }

  const buscarProntuarios = useCallback(async (termo: string) => {
    if (!termo.trim()) {
      setProntuarioResults([])
      setShowProntuarioDropdown(false)
      return
    }
    setSearchingProntuario(true)
    try {
      const res = await api.get(`/api/triagens/prontuarios?q=${encodeURIComponent(termo)}`)
      setProntuarioResults(res.data)
      setShowProntuarioDropdown(res.data.length > 0)
    } catch {
      setProntuarioResults([])
    }
    setSearchingProntuario(false)
  }, [])

  function onProntuarioInputChange(value: string) {
    setProntuarioSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => buscarProntuarios(value), 300)
  }

  function selecionarProntuario(p: Prontuario) {
    setForm(f => ({ ...f, prontuarioId: String(p.id), prontuarioLabel: `${p.paciente?.nome}${p.paciente?.cpf ? ` (${p.paciente.cpf})` : ''}` }))
    setProntuarioSearch(`${p.paciente?.nome}${p.paciente?.cpf ? ` - ${p.paciente.cpf}` : ''}`)
    setShowProntuarioDropdown(false)
  }

  function limparProntuario() {
    setForm(f => ({ ...f, prontuarioId: '', prontuarioLabel: '' }))
    setProntuarioSearch('')
    setProntuarioResults([])
  }

  function abrirModalNovo() {
    setForm(FORM_VAZIO)
    setProntuarioSearch('')
    setProntuarioResults([])
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(t: Triagem) {
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
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.prontuarioId || !form.medicoId || !form.condicaoClinica) {
      setErroForm('Preencha todos os campos obrigatórios.')
      return
    }

    const body: Record<string, unknown> = {
      prontuario: { id: parseInt(form.prontuarioId) },
      medico: { id: parseInt(form.medicoId) },
      condicaoClinica: form.condicaoClinica,
      pressaoArterial: form.pressaoArterial || null,
      febre: form.febre ? parseFloat(form.febre) : null,
      condicaoNutricional: form.condicaoNutricional || null,
      condicaoSocial: form.condicaoSocial || null,
      observacoes: form.observacoes || null,
    }

    const url = form.id ? `/api/triagens/${form.id}` : '/api/triagens'
    const method = form.id ? 'PUT' : 'POST'
    try {
      await api({ url, method, data: body })
      setModalAberto(false)
      carregarDados()
    } catch {
      setErroForm('Erro ao salvar triagem. Verifique os dados e tente novamente.')
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/api/triagens/${idParaExcluir}`)
    } catch {}
    setIdParaExcluir(null)
    carregarDados()
  }

  function formatarDataHora(d: string | undefined) {
    if (!d) return '-'
    return new Date(d).toLocaleString('pt-BR')
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#030213]/5 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-[#030213]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Triagem</h3>
        </div>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Triagem
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Médico</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pressão</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Febre</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cond. Clínica</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Carregando...
                </td>
              </tr>
            ) : triagens.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  Nenhuma triagem cadastrada
                </td>
              </tr>
            ) : (
              triagens.map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{t.prontuario?.paciente?.nome ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{t.medico?.usuario?.nome ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{formatarDataHora(t.dataTriagem)}</td>
                  <td className="px-6 py-4 text-gray-600">{t.pressaoArterial ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{t.febre != null ? `${t.febre}°C` : '-'}</td>
                  <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{t.condicaoClinica}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModalEdicao(t)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIdParaExcluir(t.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CRIAR/EDITAR */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Triagem' : 'Nova Triagem'}</h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div ref={prontuarioRef} className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Digite nome, CPF ou código do prontuário"
                      value={prontuarioSearch}
                      onChange={e => onProntuarioInputChange(e.target.value)}
                      onFocus={() => { if (prontuarioResults.length > 0) setShowProntuarioDropdown(true) }}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {searchingProntuario ? (
                        <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {showProntuarioDropdown && prontuarioResults.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {prontuarioResults.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => selecionarProntuario(p)}
                          className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{p.paciente?.nome}</span>
                          {p.paciente?.cpf && <span className="text-gray-400 ml-2">{p.paciente.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}</span>}
                          <span className="text-gray-400 ml-2 text-xs">#{p.id}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {form.prontuarioId && !showProntuarioDropdown && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Selecionado: {form.prontuarioLabel}</span>
                      <button type="button" onClick={limparProntuario} className="text-gray-400 hover:text-red-500">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Médico <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={form.medicoId}
                    onChange={e => setForm(f => ({ ...f, medicoId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  >
                    <option value="">Selecione um médico</option>
                    {medicos.map(m => (
                      <option key={m.id} value={m.id}>{m.usuario?.nome ?? `CRM ${m.crm}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pressão Arterial</label>
                  <input
                    type="text"
                    placeholder="Ex: 12x8"
                    value={form.pressaoArterial}
                    onChange={e => setForm(f => ({ ...f, pressaoArterial: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Febre (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 37.5"
                    value={form.febre}
                    onChange={e => setForm(f => ({ ...f, febre: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condição Clínica <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  placeholder="Descreva a condição clínica do paciente"
                  value={form.condicaoClinica}
                  onChange={e => setForm(f => ({ ...f, condicaoClinica: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condição Nutricional</label>
                  <textarea
                    rows={2}
                    placeholder="Condição nutricional do paciente"
                    value={form.condicaoNutricional}
                    onChange={e => setForm(f => ({ ...f, condicaoNutricional: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condição Social</label>
                  <textarea
                    rows={2}
                    placeholder="Condição social do paciente"
                    value={form.condicaoSocial}
                    onChange={e => setForm(f => ({ ...f, condicaoSocial: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                <textarea
                  rows={2}
                  placeholder="Observações adicionais"
                  value={form.observacoes}
                  onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
              {erroForm && (
                <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO DELETE */}
      {idParaExcluir !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Excluir triagem</h3>
                <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIdParaExcluir(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
