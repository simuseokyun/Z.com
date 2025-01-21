import TabDecider from '@/app/(afterLogin)/home/_component/TabDecider';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getPostRecommends } from '../_lib/getPostRecommend';

export default async function TabDeciderSuspense() {
    const queryClient = new QueryClient();
    await queryClient.prefetchInfiniteQuery({
        queryKey: ['posts', 'recommends'],
        queryFn: getPostRecommends,
        initialPageParam: 0, // 처음 커서 값
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
