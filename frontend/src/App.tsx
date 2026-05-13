import { Routes, Route, Navigate } from 'react-router-dom'
import { useSystemConfig } from './contexts/SystemConfigContext'
import Dashboard from './pages/Dashboard'
import PacientesPage from './pages/GerenciarPacientes'
import Profissionais from './pages/Profissionais'
import Consultas from './pages/Consultas'
import Prontuarios from './pages/Prontuarios'
import Alimentos from './pages/Alimentos'
import Compras from './pages/Compras'
import Exames from './pages/Exames'
import TriagemPage from './pages/Triagem'
import Configuracoes from './pages/Configuracoes'
import GerenciarUsuarios from './pages/GerenciarUsuarios'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyOTP from './pages/VerifyOTP'
import EsqueciSenha from './pages/EsqueciSenha'
import Doacoes from './pages/Doacoes'
import { useAuth } from './hooks/useAuth'
import AppLayout from './components/AppLayout'
import { SystemConfigProvider } from './contexts/SystemConfigContext'

function App() {
  return (
    <SystemConfigProvider>
      <AppRoutes />
    </SystemConfigProvider>
  )
}

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth()
  const { parametrizacaoExiste, loaded } = useSystemConfig()

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#030213] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && !parametrizacaoExiste) {
    if (isAdmin) {
      return (
        <AppLayout>
          <Navigate to="/configuracoes" replace />
          <Configuracoes />
        </AppLayout>
      )
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sistema não configurado</h1>
          <p className="text-gray-500">
            O sistema ainda não foi configurado pelo administrador. Aguarde até que a parametrização seja concluída.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verificar" element={<VerifyOTP />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <AppLayout><Dashboard /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/pacientes"
        element={isAuthenticated ? <AppLayout><PacientesPage /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/profissionais"
        element={isAuthenticated ? <AppLayout><Profissionais /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/consultas"
        element={isAuthenticated ? <AppLayout><Consultas /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/prontuarios"
        element={isAuthenticated ? <AppLayout><Prontuarios /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/alimentos"
        element={isAuthenticated ? <AppLayout><Alimentos /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/compras"
        element={isAuthenticated ? <AppLayout><Compras /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/exames"
        element={isAuthenticated ? <AppLayout><Exames /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/triagem"
        element={isAuthenticated ? <AppLayout><TriagemPage /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/doacoes"
        element={isAuthenticated ? <AppLayout><Doacoes /></AppLayout> : <Navigate to="/login" />}
      />
      <Route
        path="/configuracoes"
        element={
          isAuthenticated && isAdmin ? (
            <AppLayout><Configuracoes /></AppLayout>
          ) : (
            null
          )
        }
      />
      <Route
        path="/usuarios"
        element={
          isAuthenticated && isAdmin ? (
            <AppLayout><GerenciarUsuarios /></AppLayout>
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
    </Routes>
  )
}

export default App