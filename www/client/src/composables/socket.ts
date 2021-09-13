import { Manager, Socket, io } from 'socket.io-client';
// @ts-ignore

// -----------------------------------------------------------------------------
// State
// -----------------------------------------------------------------------------
const sockets: { [name: string]: Socket } = {}

// -----------------------------------------------------------------------------
// Composable
// -----------------------------------------------------------------------------
export function useSocket(nsp: string) {

  // const manager = new Manager('http://localhost:8080', {
  //   withCredentials: true,
  // })

  // -------------------------------------------------------------------------
  // Datas
  // -------------------------------------------------------------------------
  // sockets[nsp] ||= manager.socket(`/${nsp}`)
  sockets[nsp] ||= io(`http://localhost:8080/${nsp}`, { withCredentials: true, forceNew: true })
  
  // -------------------------------------------------------------------------
  // Functions
  // -------------------------------------------------------------------------
  function close() {
    sockets[nsp]?.close()
    delete sockets[nsp]
  }

  function refresh() {
    console.log('in refresh, nsp: ' + nsp)
    sockets[nsp]?.disconnect()
    sockets[nsp]?.connect({ withCredentials: true })
  }

  return {
    // Datas
    socket: sockets[nsp],

    // Functions
    close,
    refresh,
  }
}
