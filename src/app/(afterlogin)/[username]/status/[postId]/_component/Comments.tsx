'use client'

import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { Fragment, useEffect } from 'react'
import Post from '@/app/(afterLogin)/_component/Post'
import { Post as IPost } from '@/model/Post'
import getComments from '../_lib/getComments'

type Props = {
  id: string
}
export default function Comments({ id }: Props) {
  const queryClient = useQueryClient()
  const post = queryClient.getQueryData(['posts', id])
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 2000,
  })
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery<
    IPost[],
    unknown,
    InfiniteData<IPost[]>,
    [_1: string, _2: string, _3: string],
    number
  >({
    queryKey: ['posts', id, 'comments'],
    queryFn: getComments,
    initialPageParam: 0,
    getNextPageParam: (lastId) => lastId.at(-1)?.postId,
    staleTime: 10 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
    enabled: !!post,
  })
  useEffect(() => {
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage])
  if (post) {
    return (
      <>
        {data?.pages.map((page, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            {page?.map((post) => (
              <Post
                key={post.postId || (post.Original?.postId as number) + 1000}
                post={post}
              />
            ))}
          </Fragment>
        ))}
        <div ref={ref} style={{ height: 10, background: 'yellow' }} />
      </>
    )
  }
}
