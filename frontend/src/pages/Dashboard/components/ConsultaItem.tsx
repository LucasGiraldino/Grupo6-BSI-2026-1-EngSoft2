import { Calendar } from 'lucide-react'

interface ConsultaItemProps {
  name: string
  specialty: string
  time: string
}

export default function ConsultaItem({ name, specialty, time }: ConsultaItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
          <Calendar className="w-6 h-6 text-blue-600" />
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
