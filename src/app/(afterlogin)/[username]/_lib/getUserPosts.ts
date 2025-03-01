import { QueryFunction } from '@tanstack/react-query'
import { Post } from '@/model/Post'

const getUserPosts: QueryFunction<
  Post[],
  [_1: string, _2: string, _3: string],
  number
> = async ({ queryKey, pageParam }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [, , username] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/posts?cursor=${pageParam}`,
    {
      next: {
        tags: ['posts', 'users', username],
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getUserPosts
