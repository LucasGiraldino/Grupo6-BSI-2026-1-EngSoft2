import { Pencil, Loader } from 'lucide-react'
import { Prontuario } from '../hooks/useProntuariosData'
import { formatarCpf } from '../../../utils/cpf'

interface ProntuariosTableProps {
  prontuarios: Prontuario[]
  carregando: boolean
  onEditar: (p: Prontuario) => void
}

export default function ProntuariosTable({ prontuarios, carregando, onEditar }: ProntuariosTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paciente</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Abertura</th>
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
          ) : prontuarios.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                Nenhum prontuário encontrado
              </td>
            </tr>
          ) : (
            prontuarios.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.id}</td>
                <td className="px-6 py-4 text-gray-600">{p.paciente?.nome ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">{p.paciente?.cpf ? formatarCpf(p.paciente.cpf) : '-'}</td>
                <td className="px-6 py-4 text-gray-600">
                  {p.dataAbertura ? new Date(p.dataAbertura).toLocaleDateString('pt-BR') : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.dataFechamento ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {p.dataFechamento ? 'Fechado' : 'Ativo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onEditar(p)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    title="Editar prontuário"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
