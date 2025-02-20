'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import useTabState from '@/store/homeTab'

import PostRecommends from './PostRecommends'
import FolloiwngPosts from './FollowingPosts'

export default function TabDecider() {
  const router = useRouter()

  const tab = useTabState((state) => state.mode) // 전체 값중에 mode만 출력, mode값이 변경되지 않는 한 리렌더링 X
  // const { mode } = useTabState();  전체 값중에 mode만 구조분해할당, 이건 useTabState() 전체상태를 구독하고 있는거라 속성 하나라도 변경되면 리렌더링

  if (tab === 'recommend') {
    return <PostRecommends />
  }
  return <FolloiwngPosts />
}
