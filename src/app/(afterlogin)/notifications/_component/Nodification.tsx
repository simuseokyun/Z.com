'use client'

import style from '../page.module.css'

export default function Nodification({ email }: { email: string }) {
  return (
    <div className={style.container}>
      <p>{email}님에게 메시지가 도착했습니다.</p>
    </div>
  )
}
