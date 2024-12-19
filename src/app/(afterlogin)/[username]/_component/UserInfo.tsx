'use client';
import { useRouter } from 'next/navigation';
import style from '../profile.module.css';

interface Props {
    user: { id: string; email: string; name: string; image: string };
}
export default function UserInfo({ user }: Props) {
    const router = useRouter();
    const onFollow = () => {};
    return (
        <div className={style.userZone}>
            <div className={style.userImage}>
                <img src={user.image} alt={user.id} />
            </div>
            <div className={style.userName}>
                <div>{user.name}</div>
                <div>@{user.id}</div>
            </div>
            <button className={style.followButton}>팔로우</button>
        </div>
    );
}
