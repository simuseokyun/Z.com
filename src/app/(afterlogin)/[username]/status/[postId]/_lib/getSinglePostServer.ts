import { cookies } from 'next/headers'

export const getSinglePostServer = async ({
  queryKey,
}: {
  queryKey: [string, string]
}) => {
  const [_1, id] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}`,
    {
      next: {
        tags: ['post', id],
      },
      credentials: 'include',
      headers: { Cookies: (await cookies()).toString() }, // 서버 컴포넌트에서 사용할땐 headers 속성 넣어주기
    },
  )
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
