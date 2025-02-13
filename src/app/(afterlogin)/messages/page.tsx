import style from './message.module.css'
import { auth } from '@/auth'
import getRooms from './_lib/getRooms'
import Room from './_component/Room'

export default async function Home() {
  const session = await auth()
  const rooms = session?.user?.email ? await getRooms(session?.user?.email) : []
  console.log(rooms)

  return (
    <main className={style.main}>
      <div className={style.header}>
        <h3>쪽지</h3>
      </div>
      {rooms.map((room) => (
        <Room key={room.room} room={room} />
      ))}
    </main>
  )
}
