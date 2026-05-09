import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PacientesPage from './pages/GerenciarPacientes'
import Profissionais from './pages/Profissionais'
import Consultas from './pages/Consultas'
import Prontuarios from './pages/Prontuarios'
import Alimentos from './pages/Alimentos'
import Compras from './pages/Compras'
import Exames from './pages/Exames'
import Configuracao from './pages/Configuracao'
import Login from './pages/Login'
import VerifyOTP from './pages/VerifyOTP'
import { EfetuarDoacao } from './pages/EfetuarDoacao'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verificar" element={<VerifyOTP />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/pacientes"
        element={isAuthenticated ? <PacientesPage /> : <Navigate to="/login" />}  
      />
      <Route
        path="/profissionais"
        element={isAuthenticated ? <Profissionais /> : <Navigate to="/login" />}
      />
      <Route
        path="/consultas"
        element={isAuthenticated ? <Consultas /> : <Navigate to="/login" />}
      />
      <Route
        path="/prontuarios"
        element={isAuthenticated ? <Prontuarios /> : <Navigate to="/login" />}
      />
      <Route
        path="/alimentos"
        element={isAuthenticated ? <Alimentos /> : <Navigate to="/login" />}
      />
      <Route
        path="/compras"
        element={isAuthenticated ? <Compras /> : <Navigate to="/login" />}
      />
      <Route
        path="/exames"
        element={isAuthenticated ? <Exames /> : <Navigate to="/login" />}
      />
      <Route
        path="/doacoes"
        element={isAuthenticated ? <EfetuarDoacao /> : <Navigate to="/login" />}
      />
      <Route
        path="/configuracao"
        element={
          isAuthenticated && isAdmin ? (
            <Configuracao />
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