import { useCallback, useEffect } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

let socket: Socket | null // socket상태를 공유하기 위해 컴포넌트 바깥에 선언
export default function useSocket(): [Socket | null, () => void] {
  const { data: session } = useSession()
  const disconnect = useCallback(() => {
    socket?.disconnect()
    socket = null
  }, [])

  useEffect(() => {
    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_BASE_URL}/messages`, {
        transports: ['websocket'],
      })
      socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`)
      })
    }
  }, [session])

  useEffect(() => {
    if (socket?.connected && session?.user?.email) {
      socket?.emit('login', { id: session?.user?.email })
    }
  }, [session])

  return [socket, disconnect]
}
