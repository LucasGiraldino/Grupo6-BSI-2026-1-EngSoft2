import { X, Loader } from 'lucide-react'
import { UsuarioFormState } from '../hooks/useUsuariosForm'
import { Usuario } from '../hooks/useUsuariosData'
import { formatarCpf, limparCpf } from '../../../utils/cpf'
import { formatarTelefone, formatarCep, limparCep, limparTelefone } from '../../../utils/validators'

interface UsuariosFormModalProps {
  aberto: boolean
  editandoId: number | null
  form: UsuarioFormState
  erroForm: { campo?: string; mensagem: string } | null
  salvando: boolean
  buscandoCep: boolean
  usuarios: Usuario[]
  onFormChange: (form: UsuarioFormState) => void
  onCepBlur: () => void
  onFechar: () => void
  onSalvar: (e: React.FormEvent) => void
}

const PERFIS = ['USUARIO', 'ADMIN']
const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export default function UsuariosFormModal({
  aberto,
  editandoId,
  form,
  erroForm,
  salvando,
  buscandoCep,
  usuarios,
  onFormChange,
  onCepBlur,
  onFechar,
  onSalvar,
}: UsuariosFormModalProps) {
  if (!aberto) return null

  function set(chave: keyof UsuarioFormState, valor: string) {
    onFormChange({ ...form, [chave]: valor })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">{editandoId ? 'Editar Usuário' : 'Novo Usuário'}</h4>
          <button onClick={onFechar} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSalvar} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => set('nome', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                placeholder="email@exemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                value={formatarCpf(form.cpf)}
                onChange={e => set('cpf', limparCpf(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] font-mono"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
              <input
                type="date"
                value={form.dataNascimento}
                onChange={e => set('dataNascimento', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={formatarTelefone(form.telefone)}
                onChange={e => set('telefone', limparTelefone(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha {editandoId && <span className="text-gray-400 font-normal">(deixe em branco para manter)</span>}
              </label>
              <input
                type="password"
                value={form.senha}
                onChange={e => set('senha', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                placeholder={editandoId ? "Nova senha (opcional)" : "Mínimo 6 caracteres"}
                required={!editandoId}
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
            {usuarios.length === 0 ? (
              <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">ADMIN</span>
                <span>Primeiro usuário será ADMIN</span>
              </div>
            ) : (
              <select
                value={form.perfil}
                onChange={e => set('perfil', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
              >
                {PERFIS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Endereço</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formatarCep(form.enderecoCep)}
                    onChange={e => set('enderecoCep', limparCep(e.target.value))}
                    onBlur={onCepBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    placeholder="00000-000"
                  />
                  {buscandoCep && (
                    <Loader className="absolute right-3 top-2.5 w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                <input
                  type="text"
                  value={form.enderecoLogradouro}
                  onChange={e => set('enderecoLogradouro', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  placeholder="Rua, Avenida..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input
                  type="text"
                  value={form.enderecoNumero}
                  onChange={e => set('enderecoNumero', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  placeholder="Nº"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                <input
                  type="text"
                  value={form.enderecoComplemento}
                  onChange={e => set('enderecoComplemento', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  placeholder="Apto, Bloco..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input
                  type="text"
                  value={form.enderecoBairro}
                  onChange={e => set('enderecoBairro', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  placeholder="Bairro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  value={form.enderecoCidade}
                  onChange={e => set('enderecoCidade', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  placeholder="Cidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={form.enderecoEstado}
                  onChange={e => set('enderecoEstado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
                >
                  <option value="">Selecione</option>
                  {ESTADOS.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <input
                  type="text"
                  value={form.enderecoPais}
                  onChange={e => set('enderecoPais', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  placeholder="Brasil"
                />
              </div>
            </div>
          </div>

          {erroForm && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{erroForm.mensagem}</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="px-6 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {salvando && <Loader className="w-4 h-4 animate-spin" />}
              {salvando ? 'Salvando...' : editandoId ? 'Salvar Alterações' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
