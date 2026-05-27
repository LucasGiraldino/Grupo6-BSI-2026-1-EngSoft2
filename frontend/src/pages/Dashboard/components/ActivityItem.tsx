interface ActivityItemProps {
  color: 'green' | 'yellow' | 'blue' | 'red'
  text: string
  time: string
}

const dotColorMap: Record<string, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
}

export default function ActivityItem({ color, text, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className={`w-2 h-2 rounded-full mt-2 ${dotColorMap[color]} flex-shrink-0`}></div>
      <div>
        <p className="text-gray-900">{text}</p>
        <p className="text-sm text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}
