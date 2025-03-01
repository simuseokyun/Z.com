import { QueryFunction } from '@tanstack/react-query'
import { Post } from '@/model/Post'

const getComments: QueryFunction<
  Post[], // useQuery말고 함수에서 타입을 처리하고 싶을 땐 InfiniteData따로 명시안해줘도 됨 (react-query자체적으로 적용시켜줌)
  [string, string, string], // queryKey 타입
  number // pageParam 타입
> = async ({ pageParam, queryKey }) => {
  const [, id] = queryKey
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${id}/comments?cursor=${pageParam}`,
    {
      next: {
        tags: ['posts', id, 'comments'],
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getComments
