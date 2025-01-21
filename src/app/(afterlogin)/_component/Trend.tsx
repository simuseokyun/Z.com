import Link from 'next/link';
import style from './trend.module.css';

export default function Trend({ trend }: { trend: { title: string; count: number } }) {
    return (
        <Link href={`/search?q=${encodeURIComponent(trend.title)}`} className={style.container}>
            {/* 주소창에 #이 들어가면 그 뒤로는 서버에 전송이 안된다. 이럴 때 encodeURIComponent라는 함수를 사용
            # => %23 으로 바꿔주는 함수 */}
            <div className={style.title}>{trend.title}</div>
            <div className={style.count}>{trend.title}</div>
            <div className={style.count}>{trend.count} posts</div>
        </Link>
    );
}
