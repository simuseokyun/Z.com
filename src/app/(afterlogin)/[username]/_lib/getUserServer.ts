import { cookies } from 'next/headers'

const getUserServer = async ({ queryKey }: { queryKey: [string, string] }) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [, username] = queryKey

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}`,
    {
      next: {
        tags: ['users', username],
      },

      headers: {
        Cookie: (await cookies()).toString(),
      },
    },
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default getUserServer
