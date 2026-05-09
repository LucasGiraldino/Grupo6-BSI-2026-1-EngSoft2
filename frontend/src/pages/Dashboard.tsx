import * as lucide from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <StatCard icon={lucide.Users} title="Pacientes Ativos" value="248" change="+12%" color="blue" />
        <StatCard icon={lucide.Calendar} title="Consultas Hoje" value="18" change="+5%" color="green" />
        <StatCard icon={lucide.TestTube} title="Exames Pendentes" value="34" change="-8%" color="yellow" negative />
        <StatCard icon={lucide.AlertCircle} title="Estoque Baixo" value="7" change="Alerta" color="red" />
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
        <div className="grid grid-cols-4 gap-4">
          <button className="p-4 bg-[#030213] text-white font-medium rounded-lg hover:opacity-90">
            Novo Paciente
          </button>
          <button className="p-4 bg-green-600 text-white font-medium rounded-lg hover:opacity-90">
            Agendar Consulta
          </button>
          <button className="p-4 bg-blue-600 text-white font-medium rounded-lg hover:opacity-90">
            Registrar Doação
          </button>
          <button className="p-4 bg-yellow-600 text-white font-medium rounded-lg hover:opacity-90">
            Solicitar Exame
          </button>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ icon: Icon, title, value, change, color, negative }: any) {
  const colorMap: any = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-3xl font-semibold text-gray-900 mt-2">{value}</h3>
        <p className={`text-sm font-medium mt-1 ${negative ? 'text-red-500' : 'text-green-500'}`}>
          {change}
        </p>
      </div>
      <div className={`${colorMap[color]} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  )
}

function ConsultaItem({ name, specialty, time }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
          <lucide.Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{specialty}</p>
        </div>
      </div>
      <p className="font-medium text-gray-900">{time}</p>
    </div>
  )
}

function ActivityItem({ color, text, time }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-2 h-2 rounded-full mt-2 bg-${color}-500 flex-shrink-0`}></div>
      <div>
        <p className="text-gray-900">{text}</p>
        <p className="text-sm text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

function Card({ title, children }: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
