const getUser = async ({
  queryKey,
}: {
  queryKey: [_1: string, _2: string]
}) => {
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
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getUser
