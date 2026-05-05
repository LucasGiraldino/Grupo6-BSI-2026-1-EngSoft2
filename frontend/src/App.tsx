import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Pacientes from './pages/Pacientes'
import Profissionais from './pages/Profissionais'
import Consultas from './pages/Consultas'
import Prontuarios from './pages/Prontuarios'
import Alimentos from './pages/Alimentos'
import Exames from './pages/Exames'
import Configuracao from './pages/Configuracao'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

function App() {
  const { isAuthenticated, isAdmin } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/pacientes"
        element={<Pacientes />}
      />
      <Route path="/profissionais" element={<Profissionais />} />
      <Route path="/consultas" element={<Consultas />} />
      <Route path="/prontuarios" element={<Prontuarios />} />
      <Route path="/alimentos" element={<Alimentos />} />
      <Route path="/exames" element={<Exames />} />
      <Route
        path="/configuracao"
        element={
          isAuthenticated && isAdmin ? (
            <Configuracao />
          ) : (
            <Navigate to="/pacientes" />
          )
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App
