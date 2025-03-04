import { cookies } from 'next/headers'
import IRoom from '@/model/Room'

const getRoomsServer = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${id}/rooms`,
    {
      credentials: 'include',
      headers: { Cookie: (await cookies()).toString() }, // 서버컴포넌트에서 데이터 가져올 땐 Cookie 값 넣어줄 것
      cache: 'no-store',
    },
  )

  if (!response.ok) {
    throw new Error('에러')
  }
  return response.json() as Promise<IRoom[]>
}

export default getRoomsServer
