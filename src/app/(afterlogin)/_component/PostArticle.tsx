'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { PostImage } from '@/model/PostImage'
import style from './post.module.css'

interface Props {
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
    Images: PostImage[]
  }
}

export default function PostArticle({ children, post }: Props) {
  const router = useRouter()
  const onClick = () => {
    router.push(`/${post.User.id}/status/${post.postId}`)
  }

  return (
    // 버블링(onClick)은 하위 -> 상위로 동작하는 것이고 캡쳐링(onClickCapture)은 상위 -> 하위로 동작
    // 즉 하위 컴포넌트를 클릭했는데 부모 컴포넌트에서 어떠한 코드를 자식보다 먼저 처리하고 싶다면 onClickCapture 사용할 것!
    <article onClick={onClick} className={style.post}>
      {children}
    </article>
  )
}
