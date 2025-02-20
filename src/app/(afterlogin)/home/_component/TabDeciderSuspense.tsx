import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import TabDecider from '@/app/(afterLogin)/home/_component/TabDecider'
import getPostRecommends from '../_lib/getPostRecommend'

export default async function TabDeciderSuspense() {
  const queryClient = new QueryClient()
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', 'recommends'],
    queryFn: getPostRecommends,
    initialPageParam: 0, // 처음 커서 값
    // prefetchQuery는 특정 페이지만 미리 요청하고 다음 페이지를 가져올 필요가 없기때문에 getNextPageParam 속성이 필수적으로 필요하지 않다.
    staleTime: 60 * 1000,
    gcTime: 120 * 1000,
  })

  const dehydratedState = dehydrate(queryClient)
  //  dehydrate는 React Query의 캐시를 JSON 형태로 변환(직렬화)하는 역할, 즉 서버에서 미리 데이터를 가져와 클라이언트가 초기 렌더 시 API 요청 없이 데이터를 즉시 사용할 수 있도록 캐시에 저장하는 것입니다.

  return (
    <HydrationBoundary state={dehydratedState}>
      {/* HydrationBoundary는 직렬화(JSON)된 데이터를 다시 재수화시켜서 React-query의 캐시에 복원함 */}
      {/* 만약 HydrationBoundary가 없다면 TabDecider내에서 초기 렌더링을 위해 데이터를 요청해야함  */}
      <TabDecider />
    </HydrationBoundary>
  )
}
