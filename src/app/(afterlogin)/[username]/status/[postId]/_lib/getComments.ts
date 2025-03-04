import { QueryFunction } from '@tanstack/react-query'
import { Post } from '@/model/Post'

const getComments: QueryFunction<
  Post[],
  [string, string, string],
  number
> = async ({ pageParam, queryKey }) => {
  const [, id] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments?cursor=${pageParam}`,
    {
      next: {
        tags: ['posts', id, 'comments'],
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getComments
