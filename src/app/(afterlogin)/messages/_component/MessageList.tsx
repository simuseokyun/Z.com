'use client'

import {
  DefaultError,
  InfiniteData,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import cx from 'classnames'

import style from './messageForm.module.css'
import { Message } from '@/model/Message'
import getMessages from '../_lib/getMessages'

interface Props {
  id: string
}
function MessageList({ id }: Props) {
  const { data: session } = useSession()
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  })
  const {
    data: messages,
    isFetching,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfiniteQuery<
    Message[],
    DefaultError,
    InfiniteData<Message[]>,
    [
      string,
      {
        senderId: string
        receiverId: string
      },
      string,
    ],
    number
  >({
    queryKey: [
      'rooms',
      { senderId: session?.user?.email as string, receiverId: id },
      'messages',
    ],
    queryFn: getMessages,
    initialPageParam: 0,
    getPreviousPageParam: (firstPage) =>
      firstPage.length < 10 ? undefined : firstPage.at(0)?.messageId,
    getNextPageParam: (lastPage) =>
      lastPage.length < 10 ? undefined : lastPage.at(-1)?.messageId,
    enabled: !!(session?.user?.email && id),
  })

  useEffect(() => {
    if (inView) {
      if (!isFetching && hasPreviousPage) {
        fetchPreviousPage()
      }
    }
  }, [inView, isFetching, hasPreviousPage])
  return (
    <div className={style.list} ref={listRef}>
      {!adjustingScroll && pageRendered && (
        <div ref={ref} style={{ height: 1, background: 'yellow' }} />
      )}
      {messages?.pages?.map((page) =>
        page.map((m) => {
          if (m.senderId === session?.user?.email) {
            // 내 메시지면
            return (
              <div
                key={m.messageId}
                className={cx(style.message, style.myMessage)}
              >
                <div className={style.content}>{m.content}</div>
                <div className={style.date}>
                  {dayjs(m.createdAt).format('YYYY년 MM월 DD일 A HH시 mm분')}
                </div>
              </div>
            )
          }
          return (
            <div
              key={m.messageId}
              className={cx(style.message, style.yourMessage)}
            >
              <div className={style.content}>{m.content}</div>
              <div className={style.date}>
                {dayjs(m.createdAt).format('YYYY년 MM월 DD일 A HH시 mm분')}
              </div>
            </div>
          )
        }),
      )}
    </div>
  )
}
export default MessageList
