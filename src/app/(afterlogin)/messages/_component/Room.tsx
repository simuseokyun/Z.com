'use client'

import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import relativeTime from 'dayjs/plugin/relativeTime'
import style from '@/app/(afterLogin)/messages/message.module.css'
import 'dayjs/locale/ko'
import IRoom from '@/model/Room'

dayjs.locale('ko')
dayjs.extend(relativeTime)

export default function Room({ room }: { room: IRoom }) {
  const router = useRouter()

  const onClick = () => {
    router.push(`/messages/${room.room}}`)
  }

  return (
    <div className={style.room} onClickCapture={onClick}>
      <div className={style.roomUserImage}>
        <img src={faker.image.avatar()} alt="" />
      </div>
      <div className={style.roomChatInfo}>
        <div className={style.roomUserInfo}>
          <b>{room.Receiver.name}</b>
          &nbsp;
          <span>@{room.Receiver.id}</span>
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
