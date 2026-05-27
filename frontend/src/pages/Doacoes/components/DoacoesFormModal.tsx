import { X, Trash2 } from 'lucide-react'
import { DoacoesFormState } from '../hooks/useDoacoesForm'
import { formatarCpf } from '../../../utils/cpf'

interface DoacoesFormModalProps {
  aberto: boolean
  state: DoacoesFormState
  onPacienteSelecionadoIdChange: (v: number | '') => void
  onAlimentoSelecionadoIdChange: (v: number | '') => void
  onQuantidadeInputChange: (v: string) => void
  onObservacoesChange: (v: string) => void
  onAdicionarItem: () => void
  onRemoverItem: (idAlimento: number) => void
  onSalvar: () => void
  onFechar: () => void
}

export default function DoacoesFormModal({
  aberto,
  state,
  onPacienteSelecionadoIdChange,
  onAlimentoSelecionadoIdChange,
  onQuantidadeInputChange,
  onObservacoesChange,
  onAdicionarItem,
  onRemoverItem,
  onSalvar,
  onFechar,
}: DoacoesFormModalProps) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{state.editandoId ? 'Editar Doação' : 'Nova Doação'}</h3>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-[1fr_2fr] gap-6">
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-base font-semibold text-gray-700 mb-3">Beneficiário</h4>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    value={state.pacienteSelecionadoId}
                    onChange={(e) => onPacienteSelecionadoIdChange(Number(e.target.value) || '')}
                  >
                    <option value="">Selecione o Paciente</option>
                    {state.pacientes.map(p => (
                      <option key={p.id} value={p.id}>{p.nome} (CPF: {formatarCpf(p.cpf)})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-base font-semibold text-gray-700 mb-3">Cesta de Alimentos</h4>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mantimento</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    value={state.alimentoSelecionadoId}
                    onChange={(e) => onAlimentoSelecionadoIdChange(Number(e.target.value) || '')}
                  >
                    <option value="">Selecione o Item</option>
                    {state.estoque.map(item => (
                      <option key={item.id} value={item.alimento.id}>
                        {item.alimento.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    placeholder="Ex: 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    value={state.quantidadeInput}
                    onChange={(e) => onQuantidadeInputChange(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={onAdicionarItem}
                  className="w-full px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity mt-2"
                >
                  Adicionar mantimento
                </button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col h-full">
                <h4 className="text-base font-semibold text-gray-700 mb-3">Mantimentos Adicionados</h4>

                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Código</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.cesta.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                            Nenhum alimento adicionado à cesta.
                          </td>
                        </tr>
                      ) : (
                        state.cesta.map(item => (
                          <tr key={item.idAlimento} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{item.idAlimento}</td>
                            <td className="px-6 py-4 text-gray-600">{item.nomeAlimento}</td>
                            <td className="px-6 py-4 text-gray-600">{item.quantidade} {item.unidadeMedida}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => onRemoverItem(item.idAlimento)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-auto border-t border-gray-200 pt-4 flex flex-col gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <textarea
                      placeholder="Escreva alguma observação aqui..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] resize-none"
                      value={state.observacoes}
                      onChange={(e) => onObservacoesChange(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                {state.mensagemErro && (
                  <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm mt-3">
                    {state.mensagemErro}
                  </div>
                )}

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={onFechar}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onSalvar}
                    className="flex-1 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
