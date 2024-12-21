import style from './home.module.css';
import TabProvider from './_component/TabProvider';
import Tab from './_component/Tab';
import PostForm from './_component/PostForm';
import Post from '../_component/Post';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getPostRecommends } from './_lib/getPostRecommend';
import PostRecommends from './_component/PostRecommends';
import TabDecider from './_component/TabDecider';
import { auth } from '@/auth';
import { query } from 'express';
import { getPostFollowings } from './_lib/getPostFollwings';

export default async function Home() {
    const session = await auth();
    const queryClient = new QueryClient();
    await Promise.all([
        queryClient.prefetchInfiniteQuery({
            queryKey: ['posts', 'recommends'],
            queryFn: getPostRecommends,
            initialPageParam: 0,
        }),
        queryClient.prefetchInfiniteQuery({
            queryKey: ['posts', 'followings'],
            queryFn: getPostFollowings,
            initialPageParam: 0,
        }),
    ]);
    const dehydrateState = dehydrate(queryClient);

    return (
        <main className={style.main}>
            <HydrationBoundary state={dehydrateState}>
                <TabProvider>
                    <Tab />
                    <PostForm me={session} />
                    <TabDecider />
                </TabProvider>
            </HydrationBoundary>
        </main>
    );
}
