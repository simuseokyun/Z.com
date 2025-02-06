import { cookies } from 'next/headers'

const getUserServer = async ({ queryKey }: { queryKey: [string, string] }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_, username] = queryKey

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
    {
      next: {
        tags: ['users', username],
      },
      credentials: 'include',
      headers: {
        Cookie: (await cookies()).toString(),
      },
      cache: 'no-store', // next15 부터는 기본 값이 되었음. 만약 캐시 사용하고 싶다면 "force-cache"
    },
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default getUserServer
