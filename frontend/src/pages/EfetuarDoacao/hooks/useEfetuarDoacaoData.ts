import { useState, useEffect, useCallback } from 'react'
import api from '../../../services/api'
import type { Paciente, Alimento, EstoqueItem } from '../../../types'
export type { Paciente, Alimento, EstoqueItem }

export function useEfetuarDoacaoData() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [estoque, setEstoque] = useState<EstoqueItem[]>([])

  const carregarPacientes = useCallback(async () => {
    try {
      const response = await api.get<Paciente[]>('/api/pacientes')
      setPacientes(Array.isArray(response.data) ? response.data : [])
    } catch {
      setPacientes([])
    }
  }, [])

  const carregarEstoque = useCallback(async () => {
    try {
      const response = await api.get<EstoqueItem[]>('/api/estoque')
      setEstoque(Array.isArray(response.data) ? response.data : [])
    } catch {
      setEstoque([])
    }
  }, [])

  useEffect(() => {
    carregarPacientes()
    carregarEstoque()
  }, [carregarPacientes, carregarEstoque])

  return { pacientes, estoque, carregarEstoque }
}
