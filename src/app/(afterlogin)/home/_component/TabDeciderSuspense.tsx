import TabDecider from '@/app/(afterLogin)/home/_component/TabDecider';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getPostRecommends } from '../_lib/getPostRecommend';

export default async function TabDeciderSuspense() {
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery({
        queryKey: ['posts', 'recommends'],
        queryFn: getPostRecommends,
        initialPageParam: 0, // 처음 커서 값
        // prefetchQuery는 특정 페이지만 미리 요청하고 다음 페이지를 가져올 필요가 없기때문에 getNextPageParam 속성이 필수적으로 필요하지 않다.
        staleTime: 30 * 1000, // 이 쿼리의 데이터는 30초 동안 신선함
        gcTime: 40 * 1000,
    });
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <TabDecider />
        </HydrationBoundary>
    );
}
