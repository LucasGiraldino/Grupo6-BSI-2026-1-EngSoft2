import { Link } from 'react-router-dom'
import { useRegister } from './hooks/useRegister'
import { formatarCpf } from '../../utils/cpf'
import { formatarTelefone } from '../../utils/validators'

export default function RegisterPage() {
  const {
    nome, setNome,
    email, setEmail,
    cpf, setCpf,
    senha, setSenha,
    dataNascimento, setDataNascimento,
    telefone, setTelefone,
    erro, loading,
    handleRegister,
  } = useRegister()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">SIGAAC</h1>
          <p className="text-sm text-gray-500">Primeiro acesso — cadastro do administrador</p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                value={formatarCpf(cpf)}
                onChange={e => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors font-mono"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input
                type="text"
                value={formatarTelefone(telefone)}
                onChange={e => setTelefone(e.target.value.replace(/\D/g, ''))}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#030213] focus:border-transparent transition-colors"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#030213] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#030213] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
            >
              Já possui conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
