import { QueryFunction } from '@tanstack/query-core'
import { Post } from '@/model/Post'

type Props = {
  searchParams: { q: string; pf?: string; f?: string }
}
const getSearchResult: QueryFunction<
  Post[],
  [_1: string, _2: string, Props['searchParams']],
  number
> = async ({ queryKey, pageParam }) => {
  const [, , searchParams] = queryKey
  const urlSearchParams = new URLSearchParams(searchParams)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?${urlSearchParams.toString()}&cursor=${pageParam}`,
    {
      next: {
        tags: ['posts', 'search', searchParams.q],
      },
      // React Query의 queryKey와 next.tags는 데이터 캐싱과 재검증에 활용되는 중요한 요소이지만, 반드시 같아야 할 필요는 없습니다.

      // queryKey: React Query에서 데이터를 캐싱하고 관리하기 위해 사용되는 키입니다. 각 쿼리 호출은 고유의 queryKey를 가져야 하며, 이를 통해 React Query는 캐시된 데이터를 식별하고 적절히 갱신합니다. useQuery에서 제공된 queryKey 배열은 데이터 요청의 고유성을 보장합니다.
      // next.tags: Next.js에서의 next.tags는 데이터의 특정 상태를 재검증하기 위해 사용됩니다. no-store 캐시 설정을 사용하지 않는 경우, 데이터를 언제 다시 가져올지 결정하는 기준이됩니다. next.tags는 문자열 배열로 작성되며, 특정 데이터가 변경되었을 때 이를 감지하여 데이터를 다시 페치하도록 합니다.
      //  cache: 'no-store'는 캐싱을 하지 말라는 뜻이라서 next.tags를 작성해도 의미가 없어지니 참고할 것
      credentials: 'include',
    },
  )

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getSearchResult
