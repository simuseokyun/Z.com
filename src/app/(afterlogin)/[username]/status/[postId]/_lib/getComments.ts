import { QueryFunction } from '@tanstack/react-query'
import { Post } from '@/model/Post'

const getComments: QueryFunction<
  Post[],
  [_1: string, _2: string, _3: string]
> = async ({ queryKey }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_1, _2, id] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments`,
    {
      next: {
        tags: ['posts', id, 'comments'],
      },
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getComments
