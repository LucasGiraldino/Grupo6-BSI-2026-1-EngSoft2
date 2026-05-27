import { Pencil, Trash2, Loader } from 'lucide-react'
import { Paciente } from '../hooks/usePacienteData'
import { formatarCpf } from '../../../utils/cpf'

interface PacienteTableProps {
  pacientes: Paciente[]
  carregando: boolean
  onEditar: (p: Paciente) => void
  onExcluir: (id: number) => void
}

export default function PacienteTable({ pacientes, carregando, onEditar, onExcluir }: PacienteTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">CPF</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data Nasc.</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sexo</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cidade/UF</th>
            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                <Loader className="w-6 h-6 mx-auto mb-2 animate-spin" />
                Carregando...
              </td>
            </tr>
          ) : pacientes.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                Nenhum paciente cadastrado
              </td>
            </tr>
          ) : (
            pacientes.map(p => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{p.nome}</td>
                <td className="px-6 py-4 text-gray-600">{formatarCpf(p.cpf)}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(p.dataNascimento).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {p.sexo === 'MASCULINO' ? 'Masculino' : p.sexo === 'FEMININO' ? 'Feminino' : 'Outro'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{p.telefone ?? '-'}</td>
                <td className="px-6 py-4 text-gray-600">
                  {p.endereco ? `${p.endereco.cidade}/${p.endereco.estado}` : '-'}
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
