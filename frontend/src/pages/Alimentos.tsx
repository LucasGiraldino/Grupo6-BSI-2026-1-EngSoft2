import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { useEffect, useState } from 'react'
import * as lucide from 'lucide-react'

interface Alimento {
  id: number
  nome: string
  categoria?: { nome: string }
  unidadeMedida: string
  dataVencimento?: string
}

export default function Alimentos() {
  const [alimentos, setAlimentos] = useState<Alimento[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [categorias, setCategorias] = useState<any[]>([])

  useEffect(() => {
    carregarAlimentos()
    carregarCategorias()
  }, [])

  const carregarAlimentos = async () => {
    try {
      const res = await fetch('/api/alimentos')
      const data = await res.json()
      setAlimentos(data)
    } catch {}
  }

  const carregarCategorias = async () => {
    try {
      const res = await fetch('/api/alimentos/categorias')
      const data = await res.json()
      setCategorias(data)
    } catch {}
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Alimentos" subtitle="Associação do Câncer - Gestão Integrada" />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Lista de Alimentos</h3>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90"
            >
              <lucide.Plus className="w-4 h-4" />
              Novo Alimento
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Categoria</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Unidade</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Vencimento</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {alimentos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Nenhum alimento cadastrado
                    </td>
                  </tr>
                ) : (
                  alimentos.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{a.nome}</td>
                      <td className="px-6 py-4 text-gray-600">{a.categoria?.nome ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{a.unidadeMedida}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {a.dataVencimento ? new Date(a.dataVencimento).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Ativo
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900">
                            <lucide.Pencil className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-600">
                            <lucide.Trash2 className="w-4 h-4" />
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
    </div>
  )
}
