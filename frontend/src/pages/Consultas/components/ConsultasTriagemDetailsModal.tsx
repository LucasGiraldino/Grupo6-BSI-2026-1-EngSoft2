import { X, Stethoscope } from 'lucide-react'
import { TriagemResumo } from '../hooks/useConsultasData'

interface ConsultasTriagemDetailsModalProps {
  triagem: TriagemResumo | null
  onFechar: () => void
}

function formatarDataHora(d: string | undefined) {
  if (!d) return '-'
  return new Date(d).toLocaleString('pt-BR')
}

export default function ConsultasTriagemDetailsModal({ triagem, onFechar }: ConsultasTriagemDetailsModalProps) {
  if (!triagem) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#030213]" />
            <h3 className="text-lg font-semibold text-gray-900">Dados da Triagem</h3>
          </div>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Data da Triagem</span>
              <p className="text-sm text-gray-900 mt-0.5">{formatarDataHora(triagem.dataTriagem)}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Médico Responsável</span>
              <p className="text-sm text-gray-900 mt-0.5">{triagem.medico?.usuario?.nome ?? '-'}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pressão Arterial</span>
              <p className="text-sm text-gray-900 mt-0.5">{triagem.pressaoArterial ?? '-'}</p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Febre</span>
              <p className="text-sm text-gray-900 mt-0.5">{triagem.febre != null ? `${triagem.febre}°C` : '-'}</p>
            </div>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Condição Clínica</span>
            <p className="text-sm text-gray-900 mt-0.5">{triagem.condicaoClinica}</p>
          </div>
          {triagem.condicaoNutricional && (
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Condição Nutricional</span>
              <p className="text-sm text-gray-900 mt-0.5">{triagem.condicaoNutricional}</p>
            </div>
          )}
          {triagem.condicaoSocial && (
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Condição Social</span>
              <p className="text-sm text-gray-900 mt-0.5">{triagem.condicaoSocial}</p>
            </div>
          )}
          {triagem.observacoes && (
            <div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Observações</span>
              <p className="text-sm text-gray-900 mt-0.5">{triagem.observacoes}</p>
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onFechar}
            className="px-4 py-2 bg-[#030213] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
