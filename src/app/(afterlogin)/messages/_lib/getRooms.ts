import { cookies } from 'next/headers'
import Room from '@/model/Room'

const getRooms = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}/rooms`,
    {
      next: { tags: ['rooms'] },
      credentials: 'include',
      headers: { Cookie: (await cookies()).toString() }, // 서버컴포넌트에서 데이터 가져올 땐 Cookie 값 넣어줄 것
      cache: 'no-cache',
    },
  )

  if (!response.ok) {
    throw new Error('에러')
  }
  return response.json() as Promise<Room[]>
}

export default getRooms
