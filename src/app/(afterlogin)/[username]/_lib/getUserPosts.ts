const getUserPosts = async ({
  queryKey,
  pageParam,
}: {
  queryKey: string[] // queryKey의 타입을 지정
  pageParam?: number
}) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [_1, _2, username] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/posts?cursor=${pageParam}`,
    {
      next: {
        tags: ['posts', 'users', username],
      },
      credentials: 'include',
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getUserPosts
