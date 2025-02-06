'use client'

import { Post as IPost } from '@/model/Post'
import { useQuery } from '@tanstack/react-query'

import Post from '../../_component/Post'
import { getSearchResult } from '../_lib/getSearchResult'

type Props = {
  searchParams: { q: string; f?: string; pf?: string }
}
export default function SearchResult({ searchParams }: Props) {
  const { data } = useQuery<
    IPost[],
    Object,
    IPost[],
    [_1: string, _2: string, Props['searchParams']]
  >({
    // queryKey나 queryFn에서 추가적인 매개변수를 사용하는 경우 타입을 정의해줘야 함 , infiniteQuery를 사용할 땐 InfiniteData를 따로 import해서 사용해야 함. InfiniteData는 {pageParam:{},page:[]} 로 이루어져 있음

    queryKey: ['posts', 'search', searchParams],
    queryFn: getSearchResult,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  })
  console.log(data)

  return data?.map((post) => <Post key={post.postId} post={post} />)
}
