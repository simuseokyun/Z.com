'use client'

import { MouseEventHandler } from 'react'
import useTabState from '@/store/homeTab'

import style from './tab.module.css'

export default function Tab() {
  const { mode, setRec, setFol } = useTabState()

  const onClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if ((e.target as HTMLDivElement).textContent === '추천') {
      setRec()
    } else if ((e.target as HTMLDivElement).textContent === '팔로우 중') {
      setFol()
    }
  }

  return (
    <div className={style.homeFixed}>
      <div className={style.homeText}>홈</div>
      <div className={style.homeTab}>
        <div onClick={onClick}>
          추천
          <div className={style.tabIndicator} hidden={mode === 'follow'} />
        </div>
        <div onClick={onClick}>
          팔로우 중
          <div className={style.tabIndicator} hidden={mode === 'recommend'} />
        </div>
      </div>
    </div>
  )
}
