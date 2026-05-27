import { Loader, Search } from 'lucide-react'
import { ConfigFormState } from '../hooks/useConfigForm'
import { formatarCnpj, limparCnpj, formatarTelefone, formatarCep, limparCep } from '../../../utils/validators'

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

interface ConfigFormProps {
  form: ConfigFormState
  salvando: boolean
  buscandoCnpj: boolean
  buscandoCep: boolean
  onFormChange: (f: ConfigFormState) => void
  onBuscarCnpj: (cnpj: string) => void
  onBuscarCep: (cep: string) => void
  onSalvar: (e: React.FormEvent) => void
  onRecarregar: () => void
}

export default function ConfigForm({
  form,
  salvando,
  buscandoCnpj,
  buscandoCep,
  onFormChange,
  onBuscarCnpj,
  onBuscarCep,
  onSalvar,
  onRecarregar,
}: ConfigFormProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Configurações do Sistema</h3>
      </div>

      <form onSubmit={onSalvar} className="space-y-8">
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Dados da Organização
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razão Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Razão social da organização"
                value={form.razaoSocial}
                onChange={e => onFormChange({ ...form, razaoSocial: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia</label>
              <input
                type="text"
                placeholder="Nome fantasia"
                value={form.nomeFantasia}
                onChange={e => onFormChange({ ...form, nomeFantasia: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="00.000.000/0000-00"
                  value={formatarCnpj(form.cnpj)}
                  onChange={e => onFormChange({ ...form, cnpj: limparCnpj(e.target.value) })}
                  onBlur={() => onBuscarCnpj(limparCnpj(form.cnpj))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  {buscandoCnpj ? (
                    <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                placeholder="(11) 99999-9999"
                value={formatarTelefone(form.telefone)}
                onChange={e => onFormChange({ ...form, telefone: e.target.value.replace(/\D/g, '') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                placeholder="contato@ong.com.br"
                value={form.email}
                onChange={e => onFormChange({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
              <input
                type="url"
                placeholder="https://"
                value={form.site}
                onChange={e => onFormChange({ ...form, site: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Fundação</label>
              <input
                type="date"
                value={form.dataFundacao}
                onChange={e => onFormChange({ ...form, dataFundacao: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Logo</label>
              <input
                type="text"
                placeholder="https://"
                value={form.logoUrl}
                onChange={e => onFormChange({ ...form, logoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Endereço</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={formatarCep(form.enderecoCep)}
                  onChange={e => onFormChange({ ...form, enderecoCep: limparCep(e.target.value) })}
                  onBlur={() => onBuscarCep(limparCep(form.enderecoCep))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
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
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
              <input
                type="text"
                placeholder="Rua, Avenida..."
                value={form.enderecoLogradouro}
                onChange={e => onFormChange({ ...form, enderecoLogradouro: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                type="text"
                placeholder="123"
                value={form.enderecoNumero}
                onChange={e => onFormChange({ ...form, enderecoNumero: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
              <input
                type="text"
                placeholder="Apto, Bloco..."
                value={form.enderecoComplemento}
                onChange={e => onFormChange({ ...form, enderecoComplemento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                type="text"
                placeholder="Centro"
                value={form.enderecoBairro}
                onChange={e => onFormChange({ ...form, enderecoBairro: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input
                  type="text"
                  placeholder="São Paulo"
                  value={form.enderecoCidade}
                  onChange={e => onFormChange({ ...form, enderecoCidade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={form.enderecoEstado}
                  onChange={e => onFormChange({ ...form, enderecoEstado: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] bg-white"
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

        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Observações</h4>
          <textarea
            rows={4}
            placeholder="Informações adicionais sobre a organização..."
            value={form.observacoes}
            onChange={e => onFormChange({ ...form, observacoes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
          />
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Segurança</h4>
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Autenticação de Dois Fatores</p>
              <p className="text-xs text-gray-500 mt-1">
                Adicione uma camada extra de segurança usando o Google Authenticator
              </p>
            </div>
            <a
              href="/configurar-2fa"
              className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
            >
              Configurar
            </a>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onRecarregar}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Descartar Alterações
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="px-6 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {salvando && <Loader className="w-4 h-4 animate-spin" />}
            {salvando ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  )
}
