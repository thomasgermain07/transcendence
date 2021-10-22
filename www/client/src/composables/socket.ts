import { Socket, io } from 'socket.io-client'

const sockets: { [name: string]: Socket } = {}

export function useSocket(nsp: string) {

  sockets[nsp] ||= io(`http://localhost:8080/${nsp}`, {
    withCredentials: true,
  })

  function close() {
    sockets[nsp]?.close()
    delete sockets[nsp]
  }

  return {
    socket: sockets[nsp],
    close,
  }
}
