import { Socket, io } from 'socket.io-client'

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const sockets: { [name: string]: Socket } = {}

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useSocket(nsp: string) {
  // -------------------------------------------------------------------------
  // Datas
  // -------------------------------------------------------------------------
  sockets[nsp] ||= io(`http://localhost:8080/${nsp}`, {
    withCredentials: true,
    forceNew: true,
  })

  // -------------------------------------------------------------------------
  // Functions
  // -------------------------------------------------------------------------
  function close() {
    sockets[nsp]?.close()
    delete sockets[nsp]
  }

  return {
    // Datas
    socket: sockets[nsp],

    // Functions
    close,
  }
}
