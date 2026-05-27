import { type ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
}

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}
