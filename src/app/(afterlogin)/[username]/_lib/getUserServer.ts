import { cookies } from 'next/headers'

const getUserServer = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [, username] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
    {
      next: {
        tags: ['users', username],
      },

      headers: { Cookie: (await cookies()).toString() },
      cache: 'no-store',
    },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch data')
    // 수동으로 에러를 날려줌으로써 useQuery에서 에러를 파악할 수 있다.
  }

  return res.json()
}

export default getUserServer
