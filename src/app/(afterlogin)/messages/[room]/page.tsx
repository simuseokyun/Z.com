import Link from 'next/link'
import cx from 'classnames'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import dayjs from 'dayjs'
import BackButton from '../../_component/BackButton'
import style from './chatRoom.module.css'
import { auth } from '@/auth'
import MessageForm from '../_component/MessageForm'
import { QueryClient } from '@tanstack/react-query'
import getUserServer from '../../[username]/_lib/getUserServer'
import MessageList from '../_component/MessageList'
import UserInfo from '../_component/UserInfo'
import WebSocketComponent from '../_component/WebSocketComponent'
dayjs.locale('ko')
dayjs.extend(relativeTime)

export default async function ChatRoom({
  params,
}: {
  params: { room: string }
}) {
  const session = await auth()
  const queryClient = new QueryClient()
  const ids = params.room.split('-').filter((v) => v !== session?.user?.email)
  if (!ids[0]) {
    return null
  }
  await queryClient.prefetchQuery({
    queryKey: ['users', ids[0]],
    queryFn: getUserServer,
  })

  const messages = [
    {
      messageId: 1,
      roomId: 123,
      id: 'zerohch0',
      content: '안녕하세요.',
      createdAt: new Date(),
    },
    {
      messageId: 2,
      roomId: 123,
      id: 'hero',
      content: '안녕히가세요.',
      createdAt: new Date(),
    },
  ]
  return (
    <main className={style.main}>
      <WebSocketComponent />
      <UserInfo id={ids[0]} />
      <MessageList id={ids[0]} />
      <MessageForm id={ids[0]} />
    </main>
  )
}
