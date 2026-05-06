import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader } from 'lucide-react'

interface Alimento {
  id: number
  nome: string
  unidadeMedida: string
}

interface ItemCompra {
  alimento: { id: number }
  quantidade: string
  preco: string
}

interface ItemCompraExibicao {
  alimento: Alimento
  quantidade: number
  preco: number
}

interface Compra {
  id: number
  dataCompra: string
  observacoes?: string
  itens: ItemCompraExibicao[]
}

const ITEM_VAZIO: ItemCompra = { alimento: { id: 0 }, quantidade: '', preco: '' }
const FORM_VAZIO = { id: '', dataCompra: '', observacoes: '' }

export default function Compras() {
  const [compras, setCompras] = useState<Compra[]>([])
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [carregando, setCarregando] = useState(true)

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [itens, setItens] = useState<ItemCompra[]>([{ ...ITEM_VAZIO }])
  const [erroForm, setErroForm] = useState('')

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  useEffect(() => {
    carregarCompras()
    carregarAlimentos()
  }, [])

  async function carregarCompras() {
    setCarregando(true)
    try {
      const res = await fetch('/api/compras')
      setCompras(await res.json())
    } catch {}
    setCarregando(false)
  }

  async function carregarAlimentos() {
    try {
      const res = await fetch('/api/alimentos')
      setAlimentos(await res.json())
    } catch {}
  }

  function abrirModalNovo() {
    setForm(FORM_VAZIO)
    setItens([{ ...ITEM_VAZIO }])
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(c: Compra) {
    setForm({
      id: String(c.id),
      dataCompra: c.dataCompra ? c.dataCompra.substring(0, 16) : '',
      observacoes: c.observacoes ?? '',
    })
    setItens(
      c.itens.length > 0
        ? c.itens.map(i => ({
            alimento: { id: i.alimento.id },
            quantidade: String(i.quantidade),
            preco: String(i.preco),
          }))
        : [{ ...ITEM_VAZIO }]
    )
    setErroForm('')
    setModalAberto(true)
  }

  function atualizarItem(index: number, campo: keyof ItemCompra, valor: string | { id: number }) {
    setItens(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item))
  }

  function adicionarItem() {
    setItens(prev => [...prev, { ...ITEM_VAZIO }])
  }

  function removerItem(index: number) {
    setItens(prev => prev.filter((_, i) => i !== index))
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (itens.some(i => !i.alimento.id || !i.quantidade || !i.preco)) {
      setErroForm('Preencha todos os campos dos itens.')
      return
    }
    const body = {
      dataCompra: form.dataCompra ? new Date(form.dataCompra).toISOString() : null,
      observacoes: form.observacoes || null,
      itens: itens.map(i => ({
        alimento: { id: i.alimento.id },
        quantidade: parseFloat(i.quantidade),
        preco: parseFloat(i.preco),
      })),
    }
    const url = form.id ? `/api/compras/${form.id}` : '/api/compras'
    const method = form.id ? 'PUT' : 'POST'
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      setModalAberto(false)
      carregarCompras()
    } catch {
      setErroForm('Erro ao salvar compra. Verifique os dados e tente novamente.')
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await fetch(`/api/compras/${idParaExcluir}`, { method: 'DELETE' })
    } catch {}
    setIdParaExcluir(null)
    carregarCompras()
  }

  function totalCompra(itens: ItemCompraExibicao[]) {
    return itens.reduce((acc, i) => acc + i.quantidade * i.preco, 0)
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Compras" subtitle="Associação do Câncer - Gestão Integrada" />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Lista de Compras</h3>
            <button
              onClick={abrirModalNovo}
              className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Nova Compra
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Itens</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Observações</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {carregando ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                      Carregando...
                    </td>
                  </tr>
                ) : compras.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                      Nenhuma compra registrada
                    </td>
                  </tr>
                ) : (
                  compras.map(c => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(c.dataCompra).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{c.itens?.length ?? 0} item(s)</td>
                      <td className="px-6 py-4 text-gray-600">
                        {c.itens ? totalCompra(c.itens).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{c.observacoes ?? '-'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEdicao(c)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIdParaExcluir(c.id)}
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
        </main>
      </div>

      {/* MODAL CRIAR/EDITAR */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Compra' : 'Nova Compra'}</h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data da Compra</label>
                    <input
                      type="datetime-local"
                      required
                      value={form.dataCompra}
                      onChange={e => setForm(f => ({ ...f, dataCompra: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                    <input
                      type="text"
                      placeholder="Opcional"
                      value={form.observacoes}
                      onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Itens</label>
                    <button
                      type="button"
                      onClick={adicionarItem}
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                    >
                      <Plus className="w-3 h-3" />
                      Adicionar item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {itens.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <select
                          required
                          value={item.alimento.id || ''}
                          onChange={e => atualizarItem(index, 'alimento', { id: parseInt(e.target.value) })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                        >
                          <option value="">Selecione o alimento</option>
                          {alimentos.map(a => (
                            <option key={a.id} value={a.id}>{a.nome}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          required
                          min="0.001"
                          step="0.001"
                          placeholder="Qtd"
                          value={item.quantidade}
                          onChange={e => atualizarItem(index, 'quantidade', e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                        />
                        <input
                          type="number"
                          required
                          min="0.01"
                          step="0.01"
                          placeholder="Preço"
                          value={item.preco}
                          onChange={e => atualizarItem(index, 'preco', e.target.value)}
                          className="w-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                        />
                        {itens.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removerItem(index)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {erroForm && (
                  <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{erroForm}</div>
                )}
              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-gray-200">
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
                <h3 className="text-lg font-semibold text-gray-900">Excluir compra</h3>
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
    </div>
  )
}
