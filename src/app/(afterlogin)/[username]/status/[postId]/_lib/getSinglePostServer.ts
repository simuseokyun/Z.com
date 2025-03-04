import { QueryFunction } from '@tanstack/query-core'
import { cookies } from 'next/headers'
import { Post } from '@/model/Post'

const getSinglePostServer: QueryFunction<Post[], [string, string]> = async ({
  queryKey,
}) => {
  const [, id] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`,
    {
      next: {
        tags: ['post', id],
      },
      headers: { Cookie: (await cookies()).toString() }, // 서버 컴포넌트에서 사용할땐 headers : cookies 넣어주기
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default getSinglePostServer
