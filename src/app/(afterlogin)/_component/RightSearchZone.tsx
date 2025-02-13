'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

import SearchForm from './SearchForm'
import style from './rightSearchZone.module.css'

export default function RightSearchZone() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const onChangeFollow = () => {
    // * 왜 new URLSearchParams를 굳이 사용하는가 ?
    // 왜냐면 useSearchParams()로 인해 받은 값은 불변성을 가지고 있어 맘대로 수정할 수 없음 (readOnly)
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('pf', 'on')
    router.replace(`/search?${newSearchParams.toString()}`)
  }
  const onChangeAll = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('pf', 'null')
    router.replace(`/search?${newSearchParams.toString()}`)
  }
  if (pathname === '/explore') {
    return null
  }
  if (pathname === '/search') {
    return (
      <div>
        <h5 className={style.filterTitle}>검색 필터</h5>
        <div className={style.filterSection}>
          <div>
            <label>사용자</label>
            <div className={style.radio}>
              <div>모든 사용자</div>
              <input
                type="radio"
                name="pf"
                defaultChecked
                onChange={onChangeAll}
              />
            </div>
            <div className={style.radio}>
              <div>내가 팔로우하는 사람들</div>
              <input
                type="radio"
                name="pf"
                value="on"
                onChange={onChangeFollow}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div style={{ marginBottom: 60, width: 'inherit' }}>
      <SearchForm />
    </div>
  )
}
