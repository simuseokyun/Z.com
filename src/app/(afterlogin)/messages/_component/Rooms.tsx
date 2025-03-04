'use client'

import { useQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'
import IRoom from '@/model/Room'
import getRooms from '../_lib/getRooms'
import Room from './Room'

interface Props {
  me: Session | null
}
export default function Rooms({ me }: Props) {
  const { data: rooms } = useQuery({
    queryKey: ['room'],
    queryFn: () => getRooms(me?.user?.email as string),
    enabled: !!me?.user?.email,
  })

  if (!rooms?.length) {
    return (
      <p style={{ textAlign: 'center', fontWeight: 500 }}>
        목록이 존재하지 않습니다
      </p>
    )
  }
  return (
    <>
      {rooms.map((room) => (
        <Room key={room.room} room={room} />
      ))}
    </>
  )
}
