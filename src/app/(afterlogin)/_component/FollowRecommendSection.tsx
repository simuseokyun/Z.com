'use client'

import { useQuery } from '@tanstack/react-query'
import { User } from '@/model/User'

import getFollowRecommends from '../_lib/getFollowRecommends'
import FollowRecommend from './FollowRecommend'

export default function FollowRecommendSection() {
  const { data, isError } = useQuery<User[]>({
    queryKey: ['users', 'followRecommends'],
    queryFn: getFollowRecommends,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  })
  if (!data || isError) {
    return <p>유저 정보를 받아올 수 없습니다.</p>
  }

  return data?.map((user) => <FollowRecommend user={user} key={user.id} />)
}
