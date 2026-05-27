import { User, Stethoscope } from 'lucide-react'
import { Consulta, TriagemResumo } from '../hooks/useConsultasData'

interface ConsultasTriagemPanelProps {
  pacientesTriagem: Consulta[]
  pacienteTriagemSelecionado: Consulta | null
  onSelectPaciente: (c: Consulta | null) => void
  onVerTriagem: (triagem: TriagemResumo) => void
}

function formatarDataHora(d: string | undefined) {
  if (!d) return '-'
  return new Date(d).toLocaleString('pt-BR')
}

export default function ConsultasTriagemPanel({
  pacientesTriagem,
  pacienteTriagemSelecionado,
  onSelectPaciente,
  onVerTriagem,
}: ConsultasTriagemPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          Pacientes da Triagem
        </h4>
        <p className="text-xs text-gray-400 mt-0.5">Aguardando agendamento</p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {pacientesTriagem.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Nenhum paciente aguardando</p>
        ) : (
          pacientesTriagem.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectPaciente(
                pacienteTriagemSelecionado?.id === c.id ? null : c
              )}
              className={`w-full text-left p-3 rounded-lg border transition-colors
                ${pacienteTriagemSelecionado?.id === c.id
                  ? 'border-[#030213] bg-gray-50 ring-1 ring-[#030213]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{c.paciente?.nome}</span>
              </div>
              <div className="text-xs text-gray-500 ml-6">
                Triagem: {formatarDataHora(c.triagem?.dataTriagem)}
              </div>
              <div className="text-xs text-gray-500 ml-6">
                {c.tipoConsulta}
              </div>
              {c.triagem && (
                <button
                  onClick={e => {
                    e.stopPropagation()
                    onVerTriagem(c.triagem!)
                  }}
                  className="mt-1 ml-6 text-xs text-[#030213] hover:underline flex items-center gap-1"
                >
                  <Stethoscope className="w-3 h-3" />
                  Ver triagem
                </button>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
