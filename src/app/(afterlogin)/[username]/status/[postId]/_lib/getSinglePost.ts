import { QueryFunction } from '@tanstack/react-query'
import { Post } from '@/model/Post'

const getSinglePost: QueryFunction<Post, [string, string]> = async ({
  queryKey,
}) => {
  const [, id] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`,
    {
      next: {
        tags: ['posts', id],
      },
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default getSinglePost
