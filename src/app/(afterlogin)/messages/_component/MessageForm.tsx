'use client'

import TextareaAutosize from 'react-textarea-autosize'
import {
  ChangeEventHandler,
  useState,
  useEffect,
  KeyboardEventHandler,
} from 'react'
import { useSession } from 'next-auth/react'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import useSocket from '../_lib/useSocket'
import { Message } from '@/model/Message'
import style from './messageForm.module.css'
import useMessageStore from '@/store/message'

interface Props {
  id: string
}

export default function MessageForm({ id }: Props) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const queryClient = useQueryClient()
  const { setGoDown } = useMessageStore()
  const [socket] = useSocket() // use가 붙은 커스텀훅은 사용하는 컴포넌트마다 상태가 공유되는게 아니라 계속 새로 생성되는 것임 (주의요망)
  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value)
  }
  const onSubmit = () => {
    if (!session?.user?.email) {
      return
    }
    const ids = [session?.user?.email, id]
    ids.sort()

    socket?.emit('sendMessage', {
      senderId: session?.user?.email,
      receiverId: id,
      content,
    })
    const messageList = queryClient.getQueryData([
      'rooms',
      {
        senderId: session?.user?.email,
        receiverId: id,
      },
      'messages',
    ]) as InfiniteData<Message[]>
    if (messageList && typeof messageList === 'object') {
      const newMessages = {
        ...messageList,
        pages: [...messageList.pages],
      }
      const lastPage = newMessages.pages.at(-1)
      const newLastPage = lastPage ? [...lastPage] : []
      const lastMessageId = lastPage?.at(-1)?.messageId

      newLastPage.push({
        senderId: session.user.email,
        receiverId: id,
        content,
        room: ids.join('-'),
        messageId: lastMessageId ? lastMessageId + 1 : 1,
        createdAt: new Date(),
      })
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
    setContent('')
  }
  const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return
      }
      e.preventDefault()
      if (!content?.trim()) {
        return
      }
      console.log('전송')
      onSubmit()
      setContent('')
    }
  }
  useEffect(() => {
    socket?.on('receiveMessage', () => {
      console.log('receiveMessage')
    })
    return () => {
      socket?.off('receiveMessage')
    }
  }, [socket])

  return (
    <div className={style.formZone}>
      <form
        className={style.form}
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <TextareaAutosize
          value={content}
          placeholder="새 쪽지 작성하기"
          onChange={onChange}
          onKeyUp={onEnter}
        />
        <button
          className={style.submitButton}
          type="submit"
          disabled={!content?.trim()}
        >
          <svg
            viewBox="0 0 24 24"
            width={18}
            aria-hidden="true"
            className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03"
          >
            <g>
              <path d="M2.504 21.866l.526-2.108C3.04 19.719 4 15.823 4 12s-.96-7.719-.97-7.757l-.527-2.109L22.236 12 2.504 21.866zM5.981 13c-.072 1.962-.34 3.833-.583 5.183L17.764 12 5.398 5.818c.242 1.349.51 3.221.583 5.183H10v2H5.981z" />
            </g>
          </svg>
        </button>
      </form>
    </div>
  )
}
