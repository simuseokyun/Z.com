'use client'

import { usePathname } from 'next/navigation'
import { Session } from 'next-auth'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Hashtag } from '@/model/Hashtag'
import getTrends from '../_lib/getTrends'
import Trend from './Trend'
import style from './trendSection.module.css'

type Props = {
  me: Session | null
  // session은 Session타입이 next-auth에 따로 존재하므로 import해서 사용할 것
}
export default function TrendSection({ me }: Props) {
  const pathname = usePathname()
  const { data } = useQuery<Hashtag[]>({
    queryKey: ['trends'],
    queryFn: getTrends,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
    enabled: !!me?.user,
  })

  if (pathname === '/explore') return null
  if (me?.user) {
    return (
      <div className={style.trendBg}>
        <div className={style.trend}>
          <h3>나를 위한 트렌드</h3>
          {data?.map((trend) => <Trend trend={trend} key={trend.title} />)}
        </div>
      </div>
    )
  }
  return (
    <div className={style.trendBg}>
      <div className={style.noTrend}>트렌드를 가져올 수 없습니다.</div>
    </div>
  )
}
