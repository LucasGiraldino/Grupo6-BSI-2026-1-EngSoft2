import { X, Loader, Search } from 'lucide-react'
import { PacienteFormState } from '../hooks/usePacienteForm'
import { formatarCpf, limparCpf } from '../../../utils/cpf'
import { formatarTelefone, formatarCep, limparCep } from '../../../utils/validators'

interface PacienteFormModalProps {
  aberto: boolean
  form: PacienteFormState
  erroForm: string
  buscandoCpf: boolean
  buscandoCep: boolean
  onFormChange: (form: PacienteFormState) => void
  onCpfBlur: () => void
  onCepBlur: () => void
  temErro: (campo: string) => string
  limparErro: (campo: string) => void
  onFechar: () => void
  onSalvar: (e: React.FormEvent) => void
}

const SEXOS = ['MASCULINO', 'FEMININO', 'OUTRO']

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export default function PacienteFormModal({
  aberto,
  form,
  erroForm,
  buscandoCpf,
  buscandoCep,
  onFormChange,
  onCpfBlur,
  onCepBlur,
  temErro,
  limparErro,
  onFechar,
  onSalvar,
}: PacienteFormModalProps) {
  if (!aberto) return null

  function set(chave: keyof PacienteFormState, valor: string) {
    onFormChange({ ...form, [chave]: valor })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Paciente' : 'Novo Paciente'}</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSalvar} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
            {/* Dados Pessoais */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Dados Pessoais</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo"
                    value={form.nome}
                    onChange={e => { set('nome', e.target.value); limparErro('nome') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('nome')}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="000.000.000-00"
                      value={formatarCpf(form.cpf)}
                      onChange={e => { set('cpf', limparCpf(e.target.value)); limparErro('cpf') }}
                      onBlur={onCpfBlur}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('cpf')}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {buscandoCpf ? (
                        <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    required
                    value={form.dataNascimento}
                    onChange={e => { set('dataNascimento', e.target.value); limparErro('dataNascimento') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('dataNascimento')}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                  <select
                    required
                    value={form.sexo}
                    onChange={e => { set('sexo', e.target.value); limparErro('sexo') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('sexo')}`}
                  >
                    <option value="">Selecione...</option>
                    {SEXOS.map(s => (
                      <option key={s} value={s}>{s === 'MASCULINO' ? 'Masculino' : s === 'FEMININO' ? 'Feminino' : 'Outro'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={formatarTelefone(form.telefone)}
                    onChange={e => { set('telefone', e.target.value.replace(/\D/g, '')); limparErro('telefone') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('telefone')}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="paciente@email.com"
                    value={form.email}
                    onChange={e => { set('email', e.target.value); limparErro('email') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('email')}`}
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Endereço</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="00000-000"
                      value={formatarCep(form.enderecoCep)}
                      onChange={e => { set('enderecoCep', limparCep(e.target.value)); limparErro('enderecoCep') }}
                      onBlur={onCepBlur}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoCep')}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {buscandoCep ? (
                        <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input
                    type="text"
                    required
                    value={form.enderecoPais}
                    onChange={e => { set('enderecoPais', e.target.value); limparErro('enderecoPais') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoPais')}`}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                  <input
                    type="text"
                    required
                    placeholder="Rua, Avenida..."
                    value={form.enderecoLogradouro}
                    onChange={e => { set('enderecoLogradouro', e.target.value); limparErro('enderecoLogradouro') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoLogradouro')}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={form.enderecoNumero}
                    onChange={e => { set('enderecoNumero', e.target.value); limparErro('enderecoNumero') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoNumero')}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    placeholder="Apto, Bloco..."
                    value={form.enderecoComplemento}
                    onChange={e => set('enderecoComplemento', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    required
                    placeholder="Centro"
                    value={form.enderecoBairro}
                    onChange={e => { set('enderecoBairro', e.target.value); limparErro('enderecoBairro') }}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoBairro')}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                    <input
                      type="text"
                      required
                      placeholder="São Paulo"
                      value={form.enderecoCidade}
                      onChange={e => { set('enderecoCidade', e.target.value); limparErro('enderecoCidade') }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoCidade')}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <select
                      required
                      value={form.enderecoEstado}
                      onChange={e => { set('enderecoEstado', e.target.value); limparErro('enderecoEstado') }}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('enderecoEstado')}`}
                    >
                      <option value="">UF</option>
                      {ESTADOS.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-100">Informações Adicionais</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Restrições Alimentares</label>
                <textarea
                  rows={3}
                  placeholder="Descreva as restrições alimentares do paciente..."
                  value={form.restricoesAlimentares}
                  onChange={e => { set('restricoesAlimentares', e.target.value); limparErro('restricoesAlimentares') }}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${temErro('restricoesAlimentares')}`}
                />
              </div>
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
