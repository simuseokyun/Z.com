'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import useSocket from '../_lib/useSocket'
import useNotificationList from '@/store/notificationList'

export default function WebSocketComponent() {
  const addContent = useNotificationList((state) => state.addContent)
  const setClickState = useNotificationList((state) => state.setClickState)

  const [socket] = useSocket()
  useEffect(() => {
    socket?.on('receiveMessage', (data) => {
      addContent({
        postId: Math.random().toString(),
        email: data.senderId,
        createAt: new Date(),
      })
      setClickState(false)
    })
  }, [socket])

  return null
}
