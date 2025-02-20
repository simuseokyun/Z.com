'use client'

import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import Post from '@/app/(afterLogin)/_component/Post'
import { Post as IPost } from '@/model/Post'
import getFollowingPosts from '../_lib/getFollowingPosts'

export default function FollowingPosts() {
  const { data, hasNextPage, fetchNextPage, isFetching } =
    useSuspenseInfiniteQuery<
      IPost[],
      unknown,
      InfiniteData<IPost[]>,
      [_1: string, _2: string],
      number // infiniteQuery에선 number까지 작성
    >({
      queryKey: ['posts', 'followings'],
      queryFn: getFollowingPosts,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
      staleTime: 60 * 1000,
      gcTime: 300 * 1000,
    })

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  })
  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage])
  return (
    <>
      {data?.pages.map((page, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={i}>
          {page.map((post) => (
            <Post
              key={post.postId || (post.Original?.postId as number) + 1000}
              post={post}
            />
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }} />
    </>
  )
}
