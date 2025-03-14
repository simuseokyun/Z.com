'use client'

import cx from 'classnames'
import dayjs from 'dayjs'
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useInView } from 'react-intersection-observer'
import { useEffect, useRef, useState } from 'react'

import { Message } from '@/model/Message'
import getMessages from '../_lib/getMessages'
import style from '@/app/(afterLogin)/messages/[room]/chatRoom.module.css'
import useMessageStore from '@/store/message'
import useSocket from '../_lib/useSocket'
import useNotificationList from '@/store/notificationList'

interface Props {
  id: string
}

export default function MessageList({ id }: Props) {
  const { data: session } = useSession()
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 1000,
  })
  const addContent = useNotificationList((state) => state.addContent)
  const { shouldGoDown, setGoDown } = useMessageStore()
  const listRef = useRef<HTMLDivElement>(null)
  const [pageRendered, setPageRendered] = useState(false)
  const [adjustingScroll, setAdjustingScroll] = useState(false)
  const {
    data: messages,
    isFetching,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfiniteQuery({
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
    // 리버스 인피니트 스크롤링이라도 getNExtPageParam값은 필수로 넣어줘야 함
  })

  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.resetQueries({
      queryKey: [
        'rooms',
        { senderId: session?.user?.email as string, receiverId: id },
        'messages',
      ],
    })
  }, [queryClient, session?.user?.email, id])

  useEffect(() => {
    if (inView) {
      if (!isFetching && hasPreviousPage && !adjustingScroll) {
        const prevHeight = listRef.current?.scrollHeight || 0
        fetchPreviousPage().then(() => {
          setAdjustingScroll(true)
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollTop =
                listRef.current.scrollHeight - prevHeight
            }
            setAdjustingScroll(false)
          }, 0)
        })
      }
    }
  }, [inView, isFetching, hasPreviousPage, fetchPreviousPage, adjustingScroll])

  const hasMessages = !!messages
  useEffect(() => {
    if (hasMessages) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight
      }
      // scrollTop: 현재 스크롤 위치 (위에서 얼마나 스크롤했는지)
      // scrollHeight: 전체 스크롤 가능한 높이 (컨텐츠의 총 높이)
      setPageRendered(true)
    }
  }, [hasMessages])

  useEffect(() => {
    if (shouldGoDown) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current?.scrollHeight
        setGoDown(false)
      }
    }
  }, [shouldGoDown, setGoDown])

  const [socket] = useSocket()
  useEffect(() => {
    socket?.on('receiveMessage', (data) => {
      // 리액트 쿼리 데이터에 추가
      console.log('메시지 받음')
      const exMessages = queryClient.getQueryData([
        'rooms',
        {
          senderId: session?.user?.email,
          receiverId: id,
        },
        'messages',
      ]) as InfiniteData<Message[]>
      if (exMessages && typeof exMessages === 'object') {
        const newMessages = {
          ...exMessages,
          pages: [...exMessages.pages],
        }
        const lastPage = newMessages.pages.at(-1)
        const newLastPage = lastPage ? [...lastPage] : []
        newLastPage.push(data)
        newMessages.pages[newMessages.pages.length - 1] = newLastPage
        queryClient.setQueryData(
          [
            'rooms',
            { senderId: session?.user?.email, receiverId: id },
            'messages',
          ],
          newMessages,
        )

        setGoDown(true)
      }
    })
    return () => {
      socket?.off('receiveMessage')
    }
  }, [socket])

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
