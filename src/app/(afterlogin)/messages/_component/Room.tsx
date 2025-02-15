'use client'

import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import relativeTime from 'dayjs/plugin/relativeTime'
import style from '@/app/(afterLogin)/messages/message.module.css'
import 'dayjs/locale/ko'
import IRoom from '@/model/Room'
import { useSession } from 'next-auth/react'

dayjs.locale('ko')
dayjs.extend(relativeTime)

export default function Room({ room }: { room: IRoom }) {
  const router = useRouter()
  const { data: session } = useSession()
  console.log('room', room.room)

  const onClick = () => {
    router.push(`/messages/${room.room}`)
  }

  const user =
    room.Receiver.id === session?.user?.email ? room.Sender : room.Receiver

  return (
    <div className={style.room} onClickCapture={onClick}>
      <div className={style.roomUserImage}>
        <img src={user.image as string} alt="profile" />
      </div>
      <div className={style.roomChatInfo}>
        <div className={style.roomUserInfo}>
          <b>{user.id}</b>
          &nbsp;
          <span>@{user.nickname}</span>
          &nbsp; · &nbsp;
          <span className={style.postDate}>
            {dayjs(room.createdAt).fromNow(true)}
          </span>
        </div>
        <div className={style.roomLastChat}>{room.content}</div>
      </div>
    </div>
  )
}
