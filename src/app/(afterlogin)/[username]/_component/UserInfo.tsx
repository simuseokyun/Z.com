'use client';
import { useRouter } from 'next/navigation';
import style from '../profile.module.css';
import { Session, User } from 'next-auth';
import { useQuery } from '@tanstack/react-query';
import { getUser } from '../_lib/getUser';
import BackButton from '../../_component/BackButton';
import { User as IUser } from '@/model/User';
import cx from 'classnames';
interface Props {
    username: string;
    session: Session | null;
}
export default function UserInfo({ username, session }: Props) {
    const { data: user, error } = useQuery<IUser, Object, IUser, [_1: string, _2: string]>({
        queryKey: ['users', username],
        queryFn: getUser,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
    });
    console.log(user);
    const followed = user?.Followers.find((follwer) => follwer.id === session?.user?.id);
    const onFollow = () => {};
    return (
        <>
            <div className={style.header}>
                <BackButton />
                <h3 className={style.headerTitle}>{user?.nickname}</h3>
            </div>
            <div className={style.userZone}>
                <div className={style.userRow}>
                    <div className={style.userImage}>
                        <img src={user?.image} alt={user?.id} />
                    </div>
                    <div className={style.userName}>
                        <div>{user?.nickname}</div>
                        <div>@{user?.id}</div>
                    </div>
                    {user?.id !== session?.user?.email && (
                        <button onClick={onFollow} className={cx(style.followButton, followed && style.followed)}>
                            {followed ? '팔로잉' : '팔로우'}
                        </button>
                    )}
                </div>

                <div className={style.userFollower}>
                    <div>{user?._count.Followers} 팔로워</div>
                    &nbsp;
                    <div>{user?._count.Followings} 팔로우 중</div>
                </div>
            </div>
        </>
    );
}
