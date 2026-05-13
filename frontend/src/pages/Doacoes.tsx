import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader } from 'lucide-react'
import Toast from '../components/Toast'
import api from '../services/api'

interface Alimento {
  id: number
  nome: string
  unidadeMedida: string
}

interface ItemDoacaoExibicao {
  id: number
  alimento: Alimento
  quantidade: number
  peso: number | null
}

interface Paciente {
  id: number
  nome: string
  cpf: string
}

interface User {
  id: number
  nome: string
}

interface Profissional {
  id: number
  usuario: User
}

interface Doacao {
  id: number
  paciente: Paciente
  profissional: Profissional
  dataDoacao: string
  observacoes?: string
  itens: ItemDoacaoExibicao[]
}

interface EstoqueItem {
  id: number
  alimento: Alimento
  quantidadeAtual: number
}

interface TabelaItem {
  idAlimento: number
  nomeAlimento: string
  quantidade: number
  unidadeMedida: string
}

export default function Doacoes() {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [carregando, setCarregando] = useState(true)
  const [filtroPacienteNome, setFiltroPacienteNome] = useState('')
  const [filtroDataInicio, setFiltroDataInicio] = useState('')
  const [filtroDataFim, setFiltroDataFim] = useState('')

  const [modalCriarAberto, setModalCriarAberto] = useState(false)
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false)
  const [doacaoDetalhes, setDoacaoDetalhes] = useState<Doacao | null>(null)
  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [pacienteSelecionadoId, setPacienteSelecionadoId] = useState<number | ''>('')
  const [estoque, setEstoque] = useState<EstoqueItem[]>([])
  const [alimentoSelecionadoId, setAlimentoSelecionadoId] = useState<number | ''>('')
  const [quantidadeInput, setQuantidadeInput] = useState<string>('')
  const [cesta, setCesta] = useState<TabelaItem[]>([])
  const [observacoes, setObservacoes] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  const [toastAberto, setToastAberto] = useState(false)
  const [toastMensagem, setToastMensagem] = useState('')
  const [toastTipo, setToastTipo] = useState<'sucesso' | 'erro' | 'aviso' | 'info'>('sucesso')

  function mostrarToast(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' | 'info' = 'sucesso') {
    setToastMensagem(mensagem)
    setToastTipo(tipo)
    setToastAberto(true)
  }

  useEffect(() => {
    carregarDoacoes()
  }, [])

  async function carregarDoacoes(nomePaciente?: string, dataInicio?: string, dataFim?: string) {
    setCarregando(true)
    try {
      const params = new URLSearchParams()
      if (nomePaciente) params.append('nomePaciente', nomePaciente)
      if (dataInicio) params.append('dataInicio', dataInicio)
      if (dataFim) params.append('dataFim', dataFim)
      const query = params.toString()
      const res = await api.get(`/api/doacoes${query ? `?${query}` : ''}`)
      setDoacoes(res.data)
    } catch {}
    setCarregando(false)
  }

  async function carregarPacientes() {
    try {
      const res = await api.get<Paciente[]>('/api/pacientes')
      setPacientes(Array.isArray(res.data) ? res.data : [])
    } catch {
      setPacientes([])
    }
  }

  async function carregarEstoque() {
    try {
      const res = await api.get<EstoqueItem[]>('/api/estoque')
      setEstoque(Array.isArray(res.data) ? res.data : [])
    } catch {
      setEstoque([])
    }
  }

  function abrirModalNovo() {
    setPacienteSelecionadoId('')
    setAlimentoSelecionadoId('')
    setQuantidadeInput('')
    setCesta([])
    setObservacoes('')
    setMensagemErro('')
    carregarPacientes()
    carregarEstoque()
    setModalCriarAberto(true)
  }

  function abrirModalDetalhes(d: Doacao) {
    setDoacaoDetalhes(d)
    setModalDetalhesAberto(true)
  }

  const handleAdicionarItem = () => {
    setMensagemErro('')
    if (!alimentoSelecionadoId) {
      setMensagemErro('Selecione um mantimento antes de adicionar.')
      return
    }
    const qtd = parseFloat(quantidadeInput)
    if (isNaN(qtd) || qtd <= 0) {
      setMensagemErro('Insira uma quantidade válida e superior a zero.')
      return
    }
    const itemEstoque = estoque.find(item => item.alimento.id === Number(alimentoSelecionadoId))
    if (!itemEstoque) return
    if (qtd > itemEstoque.quantidadeAtual) {
      setMensagemErro(`Estoque insuficiente. Disponível: ${itemEstoque.quantidadeAtual} ${itemEstoque.alimento.unidadeMedida}`)
      return
    }
    const itemExistenteIdx = cesta.findIndex(i => i.idAlimento === itemEstoque.alimento.id)
    if (itemExistenteIdx > -1) {
      const novaCesta = [...cesta]
      const novaQtd = novaCesta[itemExistenteIdx].quantidade + qtd
      if (novaQtd > itemEstoque.quantidadeAtual) {
        setMensagemErro(`Quantidade total ultrapassa estoque disponível de ${itemEstoque.quantidadeAtual} ${itemEstoque.alimento.unidadeMedida}`)
        return
      }
      novaCesta[itemExistenteIdx].quantidade = novaQtd
      setCesta(novaCesta)
    } else {
      setCesta([...cesta, {
        idAlimento: itemEstoque.alimento.id,
        nomeAlimento: itemEstoque.alimento.nome,
        quantidade: qtd,
        unidadeMedida: itemEstoque.alimento.unidadeMedida
      }])
    }
    setAlimentoSelecionadoId('')
    setQuantidadeInput('')
  }

  const handleRemoverItem = (idAlimento: number) => {
    setCesta(cesta.filter(i => i.idAlimento !== idAlimento))
  }

  const handleSalvarDoacao = async () => {
    setMensagemErro('')
    if (!pacienteSelecionadoId) {
      setMensagemErro('Selecione o paciente beneficiário antes de salvar.')
      return
    }
    if (cesta.length === 0) {
      setMensagemErro('Adicione pelo menos um mantimento na cesta.')
      return
    }
    try {
      await api.post('/api/doacoes', {
        idPaciente: Number(pacienteSelecionadoId),
        idProfissional: 1,
        observacoes,
        itens: cesta.map(item => ({
          idAlimento: item.idAlimento,
          quantidade: item.quantidade
        }))
      })
      mostrarToast('Doação cadastrada com sucesso!', 'sucesso')
      setModalCriarAberto(false)
      carregarDoacoes()
      carregarEstoque()
    } catch (err: any) {
      setMensagemErro(err.response?.data || 'Erro ao registrar doação no servidor.')
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/api/doacoes/${idParaExcluir}`)
      mostrarToast('Doação excluída com sucesso!', 'sucesso')
    } catch {}
    setIdParaExcluir(null)
    carregarDoacoes()
  }

  function formatarDataHora(d: string | undefined) {
    if (!d) return '-'
    return new Date(d).toLocaleString('pt-BR')
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Doações</h3>
        <button
          onClick={abrirModalNovo}
          className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Nova Doação
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Paciente</label>
          <input
            type="text"
            placeholder="Buscar por nome do paciente..."
            value={filtroPacienteNome}
            onChange={e => setFiltroPacienteNome(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] w-64"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Data Início</label>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={e => setFiltroDataInicio(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Data Fim</label>
          <input
            type="date"
            value={filtroDataFim}
            onChange={e => setFiltroDataFim(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
          />
        </div>
        <button
          onClick={() => carregarDoacoes(filtroPacienteNome, filtroDataInicio, filtroDataFim)}
          className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Buscar
        </button>
        <button
          onClick={() => {
            setFiltroPacienteNome('')
            setFiltroDataInicio('')
            setFiltroDataFim('')
            carregarDoacoes()
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Profissional</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Itens</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Carregando...
                </td>
              </tr>
            ) : doacoes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  Nenhuma doação registrada
                </td>
              </tr>
            ) : (
              doacoes.map(d => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{d.id}</td>
                  <td className="px-6 py-4 text-gray-600">{d.paciente?.nome ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{d.profissional?.usuario?.nome ?? '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{formatarDataHora(d.dataDoacao)}</td>
                  <td className="px-6 py-4 text-gray-600">{d.itens?.length ?? 0} item(ns)</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => abrirModalDetalhes(d)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                        title="Visualizar detalhes"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIdParaExcluir(d.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                        title="Excluir"
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

      {/* MODAL CRIAR DOAÇÃO */}
      {modalCriarAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nova Doação</h3>
              <button onClick={() => setModalCriarAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
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
                        value={pacienteSelecionadoId}
                        onChange={(e) => setPacienteSelecionadoId(Number(e.target.value) || '')}
                      >
                        <option value="">Selecione o Paciente</option>
                        {pacientes.map(p => (
                          <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
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
                        value={alimentoSelecionadoId}
                        onChange={(e) => setAlimentoSelecionadoId(Number(e.target.value) || '')}
                      >
                        <option value="">Selecione o Item</option>
                        {estoque.map(item => (
                          <option key={item.id} value={item.alimento.id}>
                            {item.alimento.nome} ({item.quantidadeAtual} {item.alimento.unidadeMedida} disp.)
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
                        value={quantidadeInput}
                        onChange={(e) => setQuantidadeInput(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAdicionarItem}
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
                          {cesta.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                Nenhum alimento adicionado à cesta.
                              </td>
                            </tr>
                          ) : (
                            cesta.map(item => (
                              <tr key={item.idAlimento} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.idAlimento}</td>
                                <td className="px-6 py-4 text-gray-600">{item.nomeAlimento}</td>
                                <td className="px-6 py-4 text-gray-600">{item.quantidade} {item.unidadeMedida}</td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => handleRemoverItem(item.idAlimento)}
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
                          value={observacoes}
                          onChange={(e) => setObservacoes(e.target.value)}
                          rows={2}
                        />
                      </div>
                    </div>

                    {mensagemErro && (
                      <div className="px-3 py-2 rounded-lg bg-red-50 text-red-700 text-sm mt-3">
                        {mensagemErro}
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={() => setModalCriarAberto(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={handleSalvarDoacao}
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
      )}

      {/* MODAL DETALHES DOAÇÃO */}
      {modalDetalhesAberto && doacaoDetalhes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detalhes da Doação #{doacaoDetalhes.id}</h3>
              <button onClick={() => setModalDetalhesAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Paciente</label>
                  <p className="text-sm text-gray-900">{doacaoDetalhes.paciente?.nome ?? '-'}</p>
                  {doacaoDetalhes.paciente?.cpf && (
                    <p className="text-xs text-gray-500">CPF: {doacaoDetalhes.paciente.cpf}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Profissional</label>
                  <p className="text-sm text-gray-900">{doacaoDetalhes.profissional?.usuario?.nome ?? '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Data da Doação</label>
                  <p className="text-sm text-gray-900">{formatarDataHora(doacaoDetalhes.dataDoacao)}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Observações</label>
                  <p className="text-sm text-gray-900">{doacaoDetalhes.observacoes || '-'}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Itens</label>
                <table className="w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Alimento</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doacaoDetalhes.itens?.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-center text-gray-400">Nenhum item</td>
                      </tr>
                    ) : (
                      doacaoDetalhes.itens?.map(item => (
                        <tr key={item.id} className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-2.5 text-gray-900">{item.alimento?.nome ?? '-'}</td>
                          <td className="px-4 py-2.5 text-gray-600">{item.quantidade} {item.alimento?.unidadeMedida ?? ''}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setModalDetalhesAberto(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
            </div>
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
                <h3 className="text-lg font-semibold text-gray-900">Excluir doação</h3>
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

      <Toast aberto={toastAberto} mensagem={toastMensagem} tipo={toastTipo} onFechar={() => setToastAberto(false)} />
    </>
  )
}
