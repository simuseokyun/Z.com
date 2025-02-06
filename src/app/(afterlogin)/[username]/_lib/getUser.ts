import { QueryFunction } from '@tanstack/react-query'
import { User } from '@/model/User'

const getUser: QueryFunction<
  User,
  [firstKey: string, secondKey: string]
> = async ({ queryKey }) => {
  const [firstKey, username] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
    {
      next: {
        tags: ['users', username],
      },
      credentials: 'include',
      cache: 'no-store',
    },
  )
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getUser
