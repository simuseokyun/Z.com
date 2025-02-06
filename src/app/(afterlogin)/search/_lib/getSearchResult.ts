import { QueryFunction } from '@tanstack/react-query'
import { Post } from '@/model/Post'

// QueryFunction이란 react-query의 queryFn 영역에 들어가는 함수의 타입을 정의할 때 사용합니다.
// QueryFunction은 첫 번째로 받은 데이터를 반환하고 두 번째로 쿼리키를 반환합니다 => QueryFunction<TData, TQueryKey>

// TData 부분엔 이 함수로 인해 받는 데이터의 타입을 명시해주면 되고 TQueryKey 부분엔 내가 useQuery를 사용하는 부분의 key의 타입을 명시해주면 됨
const getSearchResult: QueryFunction<
  Post[],
  [
    firstKey: string,
    secondKey: string,
    searchParams: { q: string; pf?: string; f?: string },
  ]
> = async ({ queryKey }) => {
  const [firstKey, secondKey, searchParams] = queryKey
  const urlSearchParams = new URLSearchParams(searchParams)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?${urlSearchParams.toString()}`,
    {
      next: {
        tags: ['posts', 'search', searchParams.q],
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
export default getSearchResult
