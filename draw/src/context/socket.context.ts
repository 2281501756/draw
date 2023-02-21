import { createContext } from 'react'
import { io } from 'socket.io-client'

const connnect = () => {
  return io(import.meta.env.VITE_WS_URL)
}

export const socketInit = connnect()

const socketContext = createContext(socketInit)

export default socketContext
