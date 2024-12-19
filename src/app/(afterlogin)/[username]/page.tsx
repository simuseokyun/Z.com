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

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
    // params와 searchParams는 Page.tsx에서만 호출할 수 있음
    const { username } = await params;
    const user: User = await getUserServer({ queryKey: ['users', username] });
    return {
        title: `${user.nickname} (${user.id}) / Z`,
        description: `${user.nickname} (${user.id}) 프로필`,
    };
}
export default async function Profile({ params }: { params: { username: string } }) {
    const { username } = await params;
    const session = await auth();
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery({ queryKey: ['users', username], queryFn: getUserServer });
    const dehydrateState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydrateState}>
            <main className={style.main}>
                <div className={style.header}>
                    <BackButton />
                    <h3 className={style.headerTitle}>{session?.user?.name}</h3>
                </div>
                {/* <UserInfo user={data?.user} /> */}
                <div></div>
            </main>
        </HydrationBoundary>
    );
}
