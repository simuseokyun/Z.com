'use client';

import { InfiniteData, useInfiniteQuery, useSuspenseInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { getFollowingPosts } from '../_lib/getFollowingPosts';
import Post from '@/app/(afterLogin)/_component/Post';
import { Post as IPost } from '@/model/Post';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
export default function FollowingPosts() {
    const { ref, inView } = useInView({
        threshold: 0, // 얼마정도 드러나야 실행할건지 0 ~ 1 사이값
        delay: 0,
    });
    const { data, isFetching, isError, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery<
        IPost[],
        Object,
        InfiniteData<IPost[]>,
        [_1: string, _2: string],
        number
    >({
        queryKey: ['posts', 'followings'],
        queryFn: getFollowingPosts,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
    });

    useEffect(() => {
        if (inView) {
            !isFetching && hasNextPage && fetchNextPage();
        }
    }, [inView, inView, isFetching, hasNextPage]);
    return (
        <>
            {data?.pages.map((page, i) => (
                <Fragment key={i}>
                    {page.map((post, z) => (
                        <Post key={z} post={post} />
                    ))}
                </Fragment>
            ))}
            <div ref={ref} style={{ height: 50 }} />
        </>
    );
}
