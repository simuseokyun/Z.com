/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */

'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import style from './post.module.css'

type Props = {
  children: ReactNode
  post: {
    postId: number
    content: string
    User: {
      id: string
      nickname: string
      image: string
    }
    createdAt: Date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Images: any[]
  }
}

export default function PostArticle({ children, post }: Props) {
  const router = useRouter()
  const onClick = () => {
    router.push(`/${post.User.id}/status/${post.postId}`)
  }

  return (
    <article onClick={onClick} className={style.post}>
      {children}
    </article>
  )
}
