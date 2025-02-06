'use client'

import {
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from '@tanstack/react-query'
import { Post as IPost } from '@/model/Post'
import { useInView } from 'react-intersection-observer'
import { Fragment, useEffect } from 'react'

import Post from '../../_component/Post'
import { getUserPosts } from '../_lib/getUserPosts'

type Props = {
  username: string
}
export default function UserPosts({ username }: Props) {
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 2000,
  })
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string, _3: string],
    number
  >({
    queryKey: ['posts', 'users', username],
    queryFn: getUserPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  })

  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['users', username])

  console.log(data)
  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage()
    }
  }, [inView])
  if (user) {
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
    )
  }
  return null
}
