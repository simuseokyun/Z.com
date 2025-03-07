'use client'

import style from '../page.module.css'

export default function Nodification({ content }: { content: string }) {
  console.log(content)
  return (
    <div className={style.container}>
      <p>{content}</p>
    </div>
  )
}
