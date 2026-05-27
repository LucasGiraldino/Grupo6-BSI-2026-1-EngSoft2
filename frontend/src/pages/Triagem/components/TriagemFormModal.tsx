import { useEffect, useRef } from 'react'
import { X, Loader, Search } from 'lucide-react'
import { Medico, Prontuario } from '../../../types'
import { TriagemFormState } from '../hooks/useTriagemForm'
import { formatarCpf } from '../../../utils/cpf'

interface TriagemFormModalProps {
  aberto: boolean
  form: TriagemFormState
  erroForm: string
  prontuarioSearch: string
  prontuarioResults: Prontuario[]
  searchingProntuario: boolean
  showProntuarioDropdown: boolean
  searchEmpty: boolean
  medicos: Medico[]
  onFormChange: (form: TriagemFormState) => void
  onProntuarioInputChange: (value: string) => void
  onSelecionarProntuario: (p: Prontuario) => void
  onLimparProntuario: () => void
  onFechar: () => void
  onSalvar: (e: React.FormEvent) => void
  onShowProntuarioDropdownChange: (value: boolean) => void
}

export default function TriagemFormModal({
  aberto,
  form,
  erroForm,
  prontuarioSearch,
  prontuarioResults,
  searchingProntuario,
  showProntuarioDropdown,
  searchEmpty,
  medicos,
  onFormChange,
  onProntuarioInputChange,
  onSelecionarProntuario,
  onLimparProntuario,
  onFechar,
  onSalvar,
  onShowProntuarioDropdownChange,
}: TriagemFormModalProps) {
  const prontuarioRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (prontuarioRef.current && !prontuarioRef.current.contains(e.target as Node)) {
        onShowProntuarioDropdownChange(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onShowProntuarioDropdownChange])

  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Triagem' : 'Nova Triagem'}</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
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
                  onFocus={() => { if (prontuarioResults.length > 0) onShowProntuarioDropdownChange(true) }}
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
                      onClick={() => onSelecionarProntuario(p)}
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{p.paciente?.nome}</span>
                      {p.paciente?.cpf && <span className="text-gray-400 ml-2">{formatarCpf(p.paciente.cpf)}</span>}
                      <span className="text-gray-400 ml-2 text-xs">#{p.id}</span>
                    </button>
                  ))}
                </div>
              )}
              {searchEmpty && !searchingProntuario && (
                <div className="mt-1 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                  Nenhum paciente encontrado.{' '}
                  <a href="/pacientes" className="underline font-medium hover:text-amber-800">
                    Cadastrar novo paciente
                  </a>
                </div>
              )}
              {form.prontuarioId && !showProntuarioDropdown && (
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Selecionado: {form.prontuarioLabel}</span>
                  <button type="button" onClick={onLimparProntuario} className="text-gray-400 hover:text-red-500">
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
                onChange={e => onFormChange({ ...form, medicoId: e.target.value })}
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
                onChange={e => onFormChange({ ...form, pressaoArterial: e.target.value })}
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
                onChange={e => onFormChange({ ...form, febre: e.target.value })}
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
              onChange={e => onFormChange({ ...form, condicaoClinica: e.target.value })}
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
                onChange={e => onFormChange({ ...form, condicaoNutricional: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condição Social</label>
              <textarea
                rows={2}
                placeholder="Condição social do paciente"
                value={form.condicaoSocial}
                onChange={e => onFormChange({ ...form, condicaoSocial: e.target.value })}
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
              onChange={e => onFormChange({ ...form, observacoes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            />
          </div>
          {erroForm && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
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
  )
}
