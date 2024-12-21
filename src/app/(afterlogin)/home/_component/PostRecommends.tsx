'use client';

import { InfiniteData, useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getPostRecommends } from '../_lib/getPostRecommend';
import Post from '../../_component/Post';
import { Post as IPost } from '@/model/Post';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function PostRecommends() {
    const { ref, inView } = useInView({
        threshold: 0,
        delay: 0,
    });
    const { data, hasNextPage, fetchNextPage, isPending, isFetching } = useInfiniteQuery<
        IPost[], // data.page의 타입
        Object, // 에러타입
        InfiniteData<IPost[]>,
        // interface InfiniteData<T> {
        //     pages: T[];  // 여러 페이지의 데이터 배열
        //     pageParams: (number | undefined)[];  // 각 페이지의 파라미터(예: cursor 등)
        // }
        [_1: string, _2: string], // 쿼리키의 타입
        number
    >({
        queryKey: ['posts', 'recommends'],
        queryFn: getPostRecommends,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.at(-1)?.postId;
        },
        //initialPageParam , getNextPageParam 가 useInfiniteQuery 필수 값
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
    });
    console.log(data);

    useEffect(() => {
        if (inView) {
            !isFetching && hasNextPage && fetchNextPage();
        }
    }, [inView, isFetching, hasNextPage, fetchNextPage]);
    return (
        <>
            {data?.pages.map((page, i) => (
                <Fragment key={i}>
                    {page.map((post) => (
                        <Post key={post.postId} post={post} />
                    ))}
                </Fragment>
            ))}
            <div ref={ref} style={{ height: 50 }} />
        </>
    );
}
