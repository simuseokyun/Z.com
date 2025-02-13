'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import style from '@/app/(afterLogin)/home/_component/tab.module.css'

export default function Tab() {
  const [tab, setTab] = useState<'hot' | 'new'>('hot')
  const searchParams = useSearchParams()
  const router = useRouter()
  const onClickFirstTab = () => {
    setTab('hot')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('f', 'null')
    router.replace(`/search?${newSearchParams.toString()}`)
  }
  const onClickSecondTab = () => {
    setTab('new')
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('f', 'live')
    router.replace(`/search?${newSearchParams.toString()}`)
  }
  return (
    <div className={style.homeFixed}>
      <div className={style.homeTab}>
        <div onClick={onClickFirstTab}>
          인기
          <div className={style.tabIndicator} hidden={tab === 'new'} />
        </div>
        <div onClick={onClickSecondTab}>
          최신
          <div className={style.tabIndicator} hidden={tab === 'hot'} />
        </div>
      </div>
    </div>
  )
}
