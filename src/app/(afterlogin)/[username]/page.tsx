import style from './profile.module.css';
import BackButton from '../_component/BackButton';
import UserInfo from './_component/UserInfo';
import { useSession } from 'next-auth/react';
import { Metadata } from 'next';
import { User } from '@/model/User';
import { getUserServer } from './_lib/getUserServer';
import { auth } from '@/auth';
import { HydrationBoundary } from '@tanstack/react-query';
import { dehydrate } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';

import { getUserPosts } from './_lib/getUserPosts';
import UserPosts from './_component/UserPosts';
export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
    // Promise<{ username: string }>는 Promise 객체를 반환하는 비동기 작업의 결과가 특정한 형태의 객체라는 것을 나타냅니다.
    const { username } = await params;
    const user: User = await getUserServer({ queryKey: ['users', username] });
    return {
        title: `${user.nickname} 프로필`,
        describe: `${user.nickname} 프로필에 오신걸 환영합니다`,
    };
}
export default async function Profile({ params }: { params: { username: string } }) {
    const { username } = await params;
    const session = await auth();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({ queryKey: ['users', username], queryFn: getUserServer });
    await queryClient.prefetchInfiniteQuery({
        queryKey: ['posts', 'users', username],
        queryFn: getUserPosts,
        initialPageParam: 0,
    });
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <main className={style.main}>
                <UserInfo username={username} session={session} />
                <UserPosts username={username} />
            </main>
        </HydrationBoundary>
    );
}
