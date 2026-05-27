import { X } from 'lucide-react'
import { ProfissionalFormState } from '../hooks/useProfissionaisForm'
import { formatarCpf } from '../../../utils/cpf'

interface ProfissionaisFormModalProps {
  aberto: boolean
  form: ProfissionalFormState
  erroForm: string
  usuarios: { id: number; nome: string; email: string; cpf: string }[]
  onFormChange: (form: ProfissionalFormState) => void
  onSalvar: (e: React.FormEvent) => void
  onFechar: () => void
}

export default function ProfissionaisFormModal({
  aberto,
  form,
  erroForm,
  usuarios,
  onFormChange,
  onSalvar,
  onFechar,
}: ProfissionaisFormModalProps) {
  if (!aberto) return null

  const usuarioSelecionado = usuarios.find(u => String(u.id) === form.usuarioId)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {form.id ? 'Editar Profissional' : 'Novo Profissional'}
          </h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <select
                required
                value={form.usuarioId}
                onChange={e => onFormChange({ ...form, usuarioId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
              >
                <option value="">Selecione um usuário...</option>
                {usuarios.map(u => (
                  <option key={u.id} value={String(u.id)}>
                    {u.nome} - {u.email}
                  </option>
                ))}
              </select>
              {usuarioSelecionado && (
                <p className="mt-1 text-xs text-gray-400">
                  CPF: {formatarCpf(usuarioSelecionado.cpf || '')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Especialidade</label>
              <input
                type="text"
                required
                placeholder="Ex: Cardiologia"
                value={form.especialidade}
                onChange={e => onFormChange({ ...form, especialidade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registro Profissional</label>
              <input
                type="text"
                required
                placeholder="Ex: CRM/SP 123456"
                value={form.registroProfissional}
                onChange={e => onFormChange({ ...form, registroProfissional: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ehMedico"
                checked={form.ehMedico}
                onChange={e => onFormChange({ ...form, ehMedico: e.target.checked })}
                className="w-4 h-4 text-[#030213] border-gray-300 rounded focus:ring-[#030213]"
              />
              <label htmlFor="ehMedico" className="text-sm font-medium text-gray-700">
                É médico?
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão</label>
              <input
                type="date"
                required
                value={form.dataAdmissao}
                onChange={e => onFormChange({ ...form, dataAdmissao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>

            {erroForm && (
              <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
            )}
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
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
