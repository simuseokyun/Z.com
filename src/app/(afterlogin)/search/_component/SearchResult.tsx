'use client'

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { Post as IPost } from '@/model/Post'
import Post from '../../_component/Post'
import getSearchResult from '../_lib/getSearchResult'

interface Props {
  searchParams: { q: string; pf?: string; f?: string }
}
type ISearchParams = { q: string; pf?: string; f?: string }
export default function SearchResult({ searchParams }: Props) {
  const { data, isFetching, hasNextPage, fetchNextPage } = useInfiniteQuery<
    IPost[],
    Error,
    InfiniteData<IPost[]>,
    [string, string, ISearchParams],
    number
  >({
    // queryKey나 queryFn에서 추가적인 매개변수를 사용하는 경우 타입을 정의해줘야 함 , infiniteQuery를 사용할 땐 InfiniteData를 따로 import해서 사용해야 함. InfiniteData는 {pageParam:{},pages:[]} 로 이루어져 있음
    queryKey: ['posts', 'search', searchParams],
    queryFn: getSearchResult,
    initialPageParam: 0,
    getNextPageParam: (lastId) => lastId.at(-1)?.postId,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  })

  const { ref, inView } = useInView({
    delay: 1000,
    threshold: 0,
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
