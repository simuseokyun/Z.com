import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import dayjs from 'dayjs'
import { QueryClient } from '@tanstack/react-query'

import style from './chatRoom.module.css'
import { auth } from '@/auth'
import MessageForm from '../_component/MessageForm'
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
  const param = await params

  const queryClient = new QueryClient()
  const ids = param?.room.split('-').filter((v) => v !== session?.user?.email)
  if (!ids[0]) {
    return null
  }
  await queryClient.prefetchQuery({
    queryKey: ['users', ids[0]],
    queryFn: getUserServer,
  })

  return (
    <main className={style.main}>
      <UserInfo id={ids[0]} />
      <MessageList id={ids[0]} />
      <MessageForm id={ids[0]} />
    </main>
  )
}
