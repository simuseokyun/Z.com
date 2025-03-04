import { QueryFunction } from '@tanstack/query-core'
import { Message } from '@/model/Message'

const getMessages: QueryFunction<
  Message[],
  [string, { senderId: string; receiverId: string }, string],
  number
> = async ({ pageParam, queryKey }) => {
  const [, userInfo] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userInfo.senderId}/rooms/${userInfo.receiverId}?cursor=${pageParam}`,
    {
      next: {
        tags: ['rooms'],
      },
      credentials: 'include',
      cache: 'no-store',
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json() as Promise<Message[]>
}

export default getMessages
