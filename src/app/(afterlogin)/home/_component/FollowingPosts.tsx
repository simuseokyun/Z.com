'use client';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';
import Post from '../../_component/Post';
import { Post as IPost } from '@/model/Post';
import { getPostFollowings } from '../_lib/getPostFollwings';
import { Fragment, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

export default function FolloiwngPosts() {
    const { ref, inView } = useInView();
    const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery<
        IPost[],
        Object,
        InfiniteData<IPost[]>,
        [_1: string, _2: string], // queryKey에 대한 타입
        number // number는 initialPageParam 및 getNextPageParam에서 사용하는 "페이지 파라미터"의 타입
    >({
        queryKey: ['posts', 'followings'],
        queryFn: getPostFollowings,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            return lastPage.at(-1)?.postId;
        },
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
            <div ref={ref} style={{ height: '50px' }} />
        </>
    );
}
