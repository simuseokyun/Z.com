import Link from 'next/link'
import { Hashtag } from '@/model/Hashtag'

import style from './trend.module.css'

interface Props {
  trend: Hashtag
}
export default function Trend({ trend }: Props) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(trend.title)}`}
      // encodeURIComponent는 공백, 특수 문자, 한글 같은 문자를 URL에서 안전하게 사용할 수 있도록 변환
      className={style.container}
    >
      <div className={style.count}>실시간트렌드</div>
      <div className={style.title}>{trend.title}</div>
      <div className={style.count}>{trend.count.toLocaleString()} posts</div>
    </Link>
  )
}
