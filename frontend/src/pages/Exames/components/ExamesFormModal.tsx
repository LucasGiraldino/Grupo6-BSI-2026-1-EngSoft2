import { useEffect, useRef } from 'react'
import { X, Loader, Search, Settings2 } from 'lucide-react'
import { ExameFormState } from '../hooks/useExamesForm'
import { formatarCpf } from '../../../utils/cpf'

interface ExamesFormModalProps {
  aberto: boolean
  form: ExameFormState
  erroForm: string
  prontuarioSearch: string
  prontuarioResults: { id: number; paciente?: { nome: string; cpf?: string }; dataAbertura?: string }[]
  searchingProntuario: boolean
  showProntuarioDropdown: boolean
  medicos: { id: number; crm: string; usuario?: { nome: string } }[]
  tiposExame: { id: number; nome: string; ativo: boolean }[]
  onFormChange: (form: ExameFormState) => void
  onProntuarioInputChange: (value: string) => void
  onSelecionarProntuario: (p: { id: number; paciente?: { nome: string; cpf?: string } }) => void
  onLimparProntuario: () => void
  onAbrirTipoModal: () => void
  onFechar: () => void
  onSalvar: (e: React.FormEvent) => void
  onShowProntuarioDropdownChange: (value: boolean) => void
}

const STATUS_OPCOES = ['SOLICITADO', 'AGENDADO', 'REALIZADO', 'CANCELADO']

export default function ExamesFormModal({
  aberto,
  form,
  erroForm,
  prontuarioSearch,
  prontuarioResults,
  searchingProntuario,
  showProntuarioDropdown,
  medicos,
  tiposExame,
  onFormChange,
  onProntuarioInputChange,
  onSelecionarProntuario,
  onLimparProntuario,
  onAbrirTipoModal,
  onFechar,
  onSalvar,
  onShowProntuarioDropdownChange,
}: ExamesFormModalProps) {
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
          <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Exame' : 'Novo Exame'}</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Exame <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <select
                  required
                  value={form.tipoExameId}
                  onChange={e => onFormChange({ ...form, tipoExameId: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                >
                  <option value="">Selecione um tipo</option>
                  {tiposExame.filter(t => t.ativo).map(t => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={onAbrirTipoModal}
                  title="Gerenciar tipos de exame"
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => onFormChange({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              >
                {STATUS_OPCOES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Justificativa Clínica <span className="text-red-500">*</span></label>
            <textarea
              required
              rows={3}
              placeholder="Descreva a justificativa clínica para o exame"
              value={form.justificativaClinica}
              onChange={e => onFormChange({ ...form, justificativaClinica: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Realização</label>
              <input
                type="date"
                value={form.dataRealizacao}
                onChange={e => onFormChange({ ...form, dataRealizacao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observações do Médico</label>
            <textarea
              rows={2}
              placeholder="Observações adicionais"
              value={form.observacoesMedico}
              onChange={e => onFormChange({ ...form, observacoesMedico: e.target.value })}
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
