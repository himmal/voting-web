import { createContext, memo, useContext } from 'react'
import { Socket } from 'socket.io-client'
import { connectSocketIO } from './api'

export let SocketContext = createContext<Socket | null>(null)

let _SocketProvider = (props) => {
  const io = connectSocketIO()
  console.log(props.children)
  return (
    <SocketContext.Provider value={io}>{props.children}</SocketContext.Provider>
  )
}

export let SocketProvider = memo(_SocketProvider)

export function useSocket() {
  let io = useContext(SocketContext)
  if (!io) {
    throw new Error(
      'useSocket() should be called inside <SocketProvider></SocketProvider>',
    )
  }
  return io
}
