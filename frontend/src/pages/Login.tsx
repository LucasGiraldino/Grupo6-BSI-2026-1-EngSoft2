import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Simulação - ajustar conforme API real
      if (email && senha) {
        localStorage.setItem('userEmail', email)
        const res = await axios.get(`/api/parametrizacao/configuracao-sistema?email=${encodeURIComponent(email)}`)
        const config = res.data
        if (config.usuarioEhAdministrador) {
          navigate('/dashboard')
        } else {
          navigate('/pacientes')
        }
      }
    } catch {
      setErro('Credenciais inválidas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">SIGAAC</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          {erro && <p className="text-sm text-red-500">{erro}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
