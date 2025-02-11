import { cookies } from 'next/headers'
import { Message } from '@/model/Message'

interface Props {
  pageParam: number
  queryKey: [string, { senderId: string; receiverId: string }, string]
}

const getMessages = async ({ pageParam, queryKey }: Props) => {
  const [one, userInfo] = queryKey
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userInfo.senderId}/rooms/${userInfo.receiverId}?cursor=${pageParam}`,
    {
      next: { tags: ['rooms'] },
      credentials: 'include',
      // headers: { Cookie: (await cookies()).toString() }, // 서버컴포넌트에서 데이터 가져올 땐 Cookie 값 넣어줄 것
      cache: 'no-cache',
    },
  )

  if (!response.ok) {
    throw new Error('에러')
  }
  return response.json() as Promise<Message[]>
}

export default getMessages
