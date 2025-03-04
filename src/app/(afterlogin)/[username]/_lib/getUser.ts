import { QueryFunction } from '@tanstack/query-core'
import { User } from '@/model/User'

const getUser: QueryFunction<User, [string, string]> = async ({ queryKey }) => {
  const [, username] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
    {
      next: {
        tags: ['users', username],
      },
      credentials: 'include',
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getUser
