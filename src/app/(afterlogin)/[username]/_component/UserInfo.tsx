'use client';
import style from '../profile.module.css';
import { useRouter } from 'next/navigation';

interface Props {
    user: { id: string; nickname: string; image: string };
}
export default function UserInfo({ user }: Props) {
    return (
        <div className={style.userZone}>
            <div className={style.userImage}>
                <img src={user.image} alt={user.id} />
            </div>
            <div className={style.userName}>
                <div>{user.nickname}</div>
                <div>@{user.id}</div>
            </div>
            <button className={style.followButton}>팔로우</button>
        </div>
    );
}
