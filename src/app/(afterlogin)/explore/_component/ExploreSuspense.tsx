import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import getTrends from '../../_lib/getTrends'

import TrendSection from './TrendSection'

export default async function ExploreSuspense() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['trends'],
    queryFn: getTrends,
  }) // 이 prefetchQuery는 처음 렌더링 될때만 작동
  const dehydratedState = dehydrate(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <TrendSection />
    </HydrationBoundary>
  )
}
