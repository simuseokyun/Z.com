'use client';
import { User } from '@/model/User';
import style from './followRecommend.module.css';
import { faker } from '@faker-js/faker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { MouseEventHandler } from 'react';

import cx from 'classnames';
type Props = { user: User };
export default function FollowRecommend({ user }: Props) {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    const followed = user.Followers.find((user) => user.id === session?.user?.email);
    const follow = useMutation({
        mutationFn: (userId: string) => {
            return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`, {
                method: 'POST',
                credentials: 'include',
            });
        },
        onMutate(userId: string) {
            const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
            if (value) {
                const index = value.findIndex((a) => a.id === userId);
                const shallow = [...value];
                shallow[index] = {
                    ...shallow[index],
                    Followers: [{ id: session?.user?.email as string }],
                    _count: {
                        ...shallow[index]._count,
                        Followers: shallow[index]._count?.Followers + 1,
                    },
                };
                queryClient.setQueryData(['users', 'followRecommends'], shallow);
            }
            const value2: User | undefined = queryClient.getQueryData(['users', userId]);
            console.log(value2);
            if (value2) {
                const shallow = {
                    ...value2,
                    Followers: [{ id: session?.user?.email }],
                    _count: {
                        ...value2._count,
                        Followers: value2._count?.Followers + 1,
                    },
                };
                queryClient.setQueryData(['users', session?.user?.email], shallow);
            }
        },
        onError(error, userId: string) {
            const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
            if (value) {
                const index = value.findIndex((a) => a.id === userId);
                const shallow = [...value];
                shallow[index] = {
                    ...shallow[index],
                    Followers: shallow[index].Followers.filter((v) => v.id !== session?.user?.email),
                    _count: {
                        ...shallow[index]._count,
                        Followers: shallow[index]._count?.Followers - 1,
                    },
                };
                queryClient.setQueryData(['users', 'followRecommends'], shallow);
            }

            const value2: User | undefined = queryClient.getQueryData(['users', userId]);
            if (value2) {
                const shallow = {
                    ...value2,
                    Followers: value2.Followers.filter((v) => v.id !== session?.user?.email),
                    _count: {
                        ...value2._count,
                        Followers: value2._count?.Followers - 1,
                    },
                };
                queryClient.setQueryData(['users', userId], shallow);
            }
        },
    });
    const unfollow = useMutation({
        mutationFn: (userId: string) => {
            console.log('unfollow', userId);
            return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`, {
                credentials: 'include',
                method: 'delete',
            });
        },
        onMutate(userId: string) {
            const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
            if (value) {
                const index = value.findIndex((a) => a.id === userId);
                const shallow = [...value];
                shallow[index] = {
                    ...shallow[index],
                    Followers: shallow[index].Followers.filter((v) => v.id !== session?.user?.email),
                    _count: {
                        ...shallow[index]._count,
                        Followers: shallow[index]._count?.Followers - 1,
                    },
                };
                queryClient.setQueryData(['users', 'followRecommends'], shallow);
            }
            const value2: User | undefined = queryClient.getQueryData(['users', userId]);
            if (value2) {
                const shallow = {
                    ...value2,
                    Followers: value2.Followers.filter((v) => v.id !== session?.user?.email),
                    _count: {
                        ...value2._count,
                        Followers: value2._count?.Followers - 1,
                    },
                };
                queryClient.setQueryData(['users', userId], shallow);
            }
        },
        onError(error, userId) {
            const value: User[] | undefined = queryClient.getQueryData(['users', 'followRecommends']);
            if (value) {
                const index = value.findIndex((a) => a.id === userId);
                const shallow = [...value];
                shallow[index] = {
                    ...shallow[index],
                    Followers: [{ id: session?.user?.email as string }],
                    _count: {
                        ...shallow[index]._count,
                        Followers: shallow[index]._count?.Followers + 1,
                    },
                };
                queryClient.setQueryData(['users', 'followRecommends'], shallow);
            }
            const value2: User | undefined = queryClient.getQueryData(['users', userId]);
            console.log(value2);
            if (value2) {
                const shallow = {
                    ...value2,
                    Followers: [{ id: session?.user?.email }],
                    _count: {
                        ...value2._count,
                        Followers: value2._count?.Followers + 1,
                    },
                };
                queryClient.setQueryData(['users', session?.user?.email], shallow);
            }
        },
    });
    const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation(); // e.stopPropagation()은 이벤트가 상위 요소로 전파되는 것을 중단합니다. / 이벤트 버블링을 중단하는 데 사용됩니다.
        e.preventDefault(); // e.preventDefault()는 이벤트의 기본 동작을 막습니다. / 주로 양식 제출, 링크 클릭, 드래그 앤 드롭 등의 기본 동작을 막는 데 사용됩니다.
        if (followed) {
            unfollow.mutate(user.id);
        } else {
            follow.mutate(user.id);
        }
    };

    return (
        <div className={style.container}>
            <div className={style.userLogoSection}>
                <div className={style.userLogo}>
                    <img src={user.image} alt={user.id} />
                </div>
            </div>
            <div className={style.userInfo}>
                <div className={style.title}>{user.nickname}</div>
                <div className={style.count}>@{user.id}</div>
            </div>
            <div className={cx(style.followButtonSection, followed && style.following)}>
                <button onClick={onFollow}>{followed ? '팔로잉' : '팔로우'}</button>
            </div>
        </div>
    );
}
