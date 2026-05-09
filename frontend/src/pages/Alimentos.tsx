import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Settings2, Loader } from 'lucide-react'
import api from '../services/api'

interface Categoria {
  id: number
  nome: string
}

interface Alimento {
  id: number
  nome: string
  descricao?: string
  categoria?: Categoria
  unidadeMedida: string
  dataVencimento?: string
}

const UNIDADES = ['KG', 'G', 'L', 'ML', 'UNIDADE', 'CAIXA', 'PACOTE']

const FORM_VAZIO = { id: '', nome: '', descricao: '', categoriaId: '', unidadeMedida: '', dataVencimento: '' }

export default function Alimentos() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [carregando, setCarregando] = useState(true)

  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState(FORM_VAZIO)
  const [erroForm, setErroForm] = useState('')

  const [modalCatAberto, setModalCatAberto] = useState(false)
  const [novaCategoria, setNovaCategoria] = useState('')

  const [idParaExcluir, setIdParaExcluir] = useState<number | null>(null)

  useEffect(() => {
    carregarCategorias()
    carregarAlimentos()
  }, [])

  async function carregarAlimentos() {
    setCarregando(true)
    try {
      const res = await api.get('/api/alimentos')
      setAlimentos(res.data)
    } catch {}
    setCarregando(false)
  }

  async function carregarCategorias() {
    try {
      const res = await api.get('/api/alimentos/categorias')
      setCategorias(res.data)
    } catch {}
  }

  function abrirModalNovo() {
    setForm(FORM_VAZIO)
    setErroForm('')
    setModalAberto(true)
  }

  function abrirModalEdicao(a: Alimento) {
    setForm({
      id: String(a.id),
      nome: a.nome,
      descricao: a.descricao ?? '',
      categoriaId: String(a.categoria?.id ?? ''),
      unidadeMedida: a.unidadeMedida ?? '',
      dataVencimento: a.dataVencimento ?? '',
    })
    setErroForm('')
    setModalAberto(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    const body = {
      nome: form.nome,
      descricao: form.descricao,
      unidadeMedida: form.unidadeMedida.toUpperCase(),
      dataVencimento: form.dataVencimento || null,
      categoria: { id: parseInt(form.categoriaId) },
    }
    const url = form.id ? `/api/alimentos/${form.id}` : '/api/alimentos'
    const method = form.id ? 'PUT' : 'POST'
    try {
      await api({ url, method, data: body })
      setModalAberto(false)
      carregarAlimentos()
    } catch {
      setErroForm('Erro ao salvar alimento. Verifique os dados e tente novamente.')
    }
  }

  async function confirmarDelete() {
    if (idParaExcluir === null) return
    try {
      await api.delete(`/api/alimentos/${idParaExcluir}`)
    } catch {}
    setIdParaExcluir(null)
    carregarAlimentos()
  }

  async function criarCategoria(e: React.FormEvent) {
    e.preventDefault()
    const nome = novaCategoria.trim()
    if (!nome) return
    await api.post('/api/alimentos/categorias', { nome })
    setNovaCategoria('')
    carregarCategorias()
  }

  async function excluirCategoria(id: number) {
    await api.delete(`/api/alimentos/categorias/${id}`)
    carregarCategorias()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Lista de Alimentos</h3>
            <button
              onClick={abrirModalNovo}
              className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Novo Alimento
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unidade</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vencimento</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
                ) : alimentos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Nenhum alimento cadastrado
                    </td>
                  </tr>
                ) : (
                  alimentos.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{a.nome}</td>
                      <td className="px-6 py-4 text-gray-600">{a.categoria?.nome ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{a.unidadeMedida ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {a.dataVencimento ? new Date(a.dataVencimento).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Ativo</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => abrirModalEdicao(a)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIdParaExcluir(a.id)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{form.id ? 'Editar Alimento' : 'Novo Alimento'}</h3>
              <button onClick={() => setModalAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={salvar} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Arroz"
                  value={form.nome}
                  onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <div className="flex gap-2">
                  <select
                    required
                    value={form.categoriaId}
                    onChange={e => setForm(f => ({ ...f, categoriaId: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setModalCatAberto(true)}
                    title="Gerenciar categorias"
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Descrição do alimento"
                  value={form.descricao}
                  onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unidade de Medida</label>
                  <select
                    required
                    value={form.unidadeMedida}
                    onChange={e => setForm(f => ({ ...f, unidadeMedida: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  >
                    <option value="">Selecione...</option>
                    {UNIDADES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    value={form.dataVencimento}
                    onChange={e => setForm(f => ({ ...f, dataVencimento: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                  />
                </div>
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

      {/* MODAL CATEGORIAS */}
      {modalCatAberto && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Categorias</h3>
              <button onClick={() => setModalCatAberto(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <form onSubmit={criarCategoria} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nome da categoria"
                  value={novaCategoria}
                  onChange={e => setNovaCategoria(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213]"
                />
                <button type="submit" className="px-3 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" />
                </button>
              </form>
              <ul className="space-y-1 max-h-60 overflow-y-auto">
                {categorias.length === 0 ? (
                  <li className="text-sm text-gray-400 text-center py-2">Nenhuma categoria cadastrada</li>
                ) : (
                  categorias.map(c => (
                    <li key={c.id} className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                      <span className="text-sm text-gray-700">{c.nome}</span>
                      <button
                        onClick={() => excluirCategoria(c.id)}
                        className="p-1 hover:bg-red-50 rounded transition-colors text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))
                )}
              </ul>
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
                <h3 className="text-lg font-semibold text-gray-900">Excluir alimento</h3>
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
