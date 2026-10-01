export type ToastTipo = 'sucesso' | 'erro' | 'aviso' | 'info'

export interface ToastEvent {
  mensagem: string
  tipo: ToastTipo
}

type ToastObserver = (evento: ToastEvent) => void

class ToastSubject {
  private observers: ToastObserver[] = []

  assinar(observer: ToastObserver): () => void {
    this.observers.push(observer)
    return () => this.desassinar(observer)
  }

  notificar(evento: ToastEvent): void {
    this.observers.forEach((observer) => observer(evento))
  }

  private desassinar(observer: ToastObserver): void {
    this.observers = this.observers.filter((registrado) => registrado !== observer)
  }
}

export const toastSubject = new ToastSubject()

export const toast = {
  mostrar(mensagem: string, tipo: ToastTipo = 'sucesso'): void {
    toastSubject.notificar({ mensagem, tipo })
  },
}
