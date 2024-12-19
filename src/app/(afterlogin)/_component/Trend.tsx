import Link from 'next/link';
import style from './trend.module.css';
import { Hashtag } from '@/model/Hashtag';

export default function Trend({ trend }: { trend: { title: string; count: number } }) {
    return (
        <Link href={`/search?q=트렌드`} className={style.container}>
            <div className={style.title}>{trend.title}</div>
            <div className={style.count}>{trend.title}</div>
        </Link>
    );
}
