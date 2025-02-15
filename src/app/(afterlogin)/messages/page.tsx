import style from './message.module.css'
import { auth } from '@/auth'
import getRooms from './_lib/getRooms'
import Room from './_component/Room'

export default async function Home() {
  const session = await auth()
  const rooms = session?.user?.email ? await getRooms(session?.user?.email) : []

  return (
    <main className={style.main}>
      <div className={style.header}>
        <h3>쪽지</h3>
      </div>
      {rooms.length ? (
        rooms.map((room) => <Room key={room.room} room={room} />)
      ) : (
        <p style={{ textAlign: 'center', fontWeight: 500 }}>
          메시지 목록이 존재하지 않습니다.
        </p>
      )}
    </main>
  )
}
