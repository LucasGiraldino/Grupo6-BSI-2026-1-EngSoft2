import { Routes, Route, Navigate } from 'react-router-dom'
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
import VerifyOTP from './pages/VerifyOTP'
import { EfetuarDoacao } from './pages/EfetuarDoacao'
import { useAuth } from './hooks/useAuth'
import AppLayout from './components/AppLayout'
import { SystemConfigProvider } from './contexts/SystemConfigContext'

function App() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <SystemConfigProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verificar" element={<VerifyOTP />} />
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
          element={isAuthenticated ? <AppLayout><EfetuarDoacao /></AppLayout> : <Navigate to="/login" />}
        />
        <Route
          path="/configuracoes"
          element={
            isAuthenticated && isAdmin ? (
              <AppLayout><Configuracoes /></AppLayout>
            ) : (
              <Navigate to="/dashboard" />
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
    </SystemConfigProvider>
  )
}

export default App