import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function Consultas() {
  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Consultas" subtitle="Associação do Câncer - Gestão Integrada" />
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-6 h-6 text-gray-300"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Módulo Consultas</h2>
            <p className="text-gray-500">Esta seção está em desenvolvimento</p>
          </div>
        </main>
      </div>
    </div>
  )
}
