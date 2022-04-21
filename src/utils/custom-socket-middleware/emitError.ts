import { Socket } from 'socket.io'

import ErrorAPI from '../../exceptions/ErrorAPI'

export interface EmitErrorOptions {
  emits: {
    event: string
    arg: (message: string) => any
  }[]
  disconnect?: boolean
}

export function emitError(socket: Socket, error: ErrorAPI, options: EmitErrorOptions) {
  const { emits, disconnect } = options

  console.error(error)
  emits.forEach(emit => socket.emit(emit.event, emit.arg(error.message)))
  if (disconnect) socket.disconnect()
  return error
}
