import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  title: string
  value: string
  change: string
  color: 'blue' | 'green' | 'yellow' | 'red'
  negative?: boolean
}

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
}

export default function StatCard({ icon: Icon, title, value, change, color, negative }: StatCardProps) {
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
