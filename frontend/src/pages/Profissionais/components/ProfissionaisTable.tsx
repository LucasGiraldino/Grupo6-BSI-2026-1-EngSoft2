import { Pencil, Trash2, Loader } from 'lucide-react'
import { Profissional } from '../hooks/useProfissionaisData'

interface ProfissionaisTableProps {
  profissionais: Profissional[]
  carregando: boolean
  onEditar: (p: Profissional) => void
  onExcluir: (id: number) => void
}

export default function ProfissionaisTable({ profissionais, carregando, onEditar, onExcluir }: ProfissionaisTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Especialidade</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Registro Profissional</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data Admissão</th>
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
          ) : profissionais.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                Nenhum profissional cadastrado
              </td>
            </tr>
          ) : (
            profissionais.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.usuario.nome}</td>
                <td className="px-6 py-4 text-gray-600">{p.especialidade}</td>
                <td className="px-6 py-4 text-gray-600">{p.registroProfissional}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(p.dataAdmissao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    p.dataDemissao ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {p.dataDemissao ? 'Demitido' : 'Ativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditar(p)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onExcluir(p.id)}
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
  )
}
