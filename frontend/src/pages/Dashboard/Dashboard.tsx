import { useNavigate } from 'react-router-dom'
import { Users, Calendar, TestTube, AlertCircle } from 'lucide-react'
import StatCard from './components/StatCard'
import Card from './components/Card'
import ConsultaItem from './components/ConsultaItem'
import ActivityItem from './components/ActivityItem'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon={Users} title="Pacientes Ativos" value="248" change="+12%" color="blue" />
        <StatCard icon={Calendar} title="Consultas Hoje" value="18" change="+5%" color="green" />
        <StatCard icon={TestTube} title="Exames Pendentes" value="34" change="-8%" color="yellow" negative />
        <StatCard icon={AlertCircle} title="Estoque Baixo" value="7" change="Alerta" color="red" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card title="Consultas de Hoje">
          <div className="space-y-4">
            <ConsultaItem name="Ana Costa" specialty="Psicologia - Dra. Carla" time="09:00" />
            <ConsultaItem name="Pedro Lima" specialty="Fisioterapia - Dr. Roberto" time="10:30" />
            <ConsultaItem name="Lucia Mendes" specialty="Psicologia - Dra. Carla" time="14:00" />
            <ConsultaItem name="Carlos Dias" specialty="Fisioterapia - Dr. Roberto" time="15:30" />
          </div>
        </Card>

        <Card title="Atividades Recentes">
          <div className="space-y-4">
            <ActivityItem color="green" text="Nova consulta agendada - Maria Silva" time="Há 5 min" />
            <ActivityItem color="yellow" text="Estoque de arroz abaixo do mínimo" time="Há 15 min" />
            <ActivityItem color="green" text="Prontuário atualizado - João Santos" time="Há 30 min" />
            <ActivityItem color="blue" text="Doação de alimentos recebida" time="Há 1 hora" />
          </div>
        </Card>
      </div>

      <Card title="Ações Rápidas">
        <div className="grid grid-cols-5 gap-4">
          <button className="p-4 bg-[#030213] text-white font-medium rounded-lg hover:opacity-90" onClick={() => navigate('/pacientes')}>
            Novo Paciente
          </button>
          <button className="p-4 bg-green-600 text-white font-medium rounded-lg hover:opacity-90" onClick={() => navigate('/consultas')}>
            Agendar Consulta
          </button>
          <button className="p-4 bg-blue-600 text-white font-medium rounded-lg hover:opacity-90" onClick={() => navigate('/doacoes')}>
            Registrar Doação
          </button>
          <button className="p-4 bg-yellow-600 text-white font-medium rounded-lg hover:opacity-90" onClick={() => navigate('/exames')}>
            Solicitar Exame
          </button>
          <button className="p-4 bg-purple-600 text-white font-medium rounded-lg hover:opacity-90" onClick={() => navigate('/verificar-horarios')}>
            Verificar Horários
          </button>
        </div>
      </Card>
    </div>
  )
}
