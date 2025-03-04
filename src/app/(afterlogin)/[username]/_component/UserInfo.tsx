'use client'

/* eslint-disable no-unsafe-optional-chaining */

import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import cx from 'classnames'
import { MouseEventHandler } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'
import { User as IUser } from '@/model/User'
import BackButton from '../../_component/BackButton'
import getUser from '../_lib/getUser'
import style from '../profile.module.css'

interface Props {
  username: string
  me: Session | null
}
export default function UserInfo({ username, me }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: user } = useSuspenseQuery<
    IUser,
    unknown,
    IUser,
    [_1: string, _2: string]
  >({
    queryKey: ['users', username],
    queryFn: getUser,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  })
  const followed = !!user?.Followers.find(
    (follower) => follower.id === me?.user?.email,
  )
  const follow = useMutation({
    mutationFn: async (userId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: 'include',
          method: 'post',
        },
      )
    },
    onMutate(userId) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      // getQueryCache()는 모든 쿼리 캐시를 가져와주고 getQueryData는 쿼리키를 필수로 작성해줘야 하며 쿼리키에 따른 특정 데이터만 가져와줌
      if (value) {
        const index = value.findIndex((v) => v.id === userId)
        if (index > -1) {
          const shallow = [...value]
          shallow[index] = {
            ...shallow[index],
            Followers: [{ id: me?.user?.email as string }],
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers + 1,
            },
          }
          queryClient.setQueryData(['users', 'followRecommends'], shallow)
        }
      }
      const userInfo: IUser | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      if (userInfo) {
        const shallow = {
          ...userInfo,
          Followers: [{ id: me?.user?.email as string }],
          _count: {
            ...userInfo._count,
            Followers: userInfo._count?.Followers + 1,
          },
        }
        queryClient.setQueryData(['users', userId], shallow)
      }
    },
    onError(error, userId) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      if (value) {
        const index = value.findIndex((user) => user.id === userId)
        const shallow = [...value]
        if (index > -1) {
          shallow[index] = {
            ...shallow[index],
            Followers: shallow[index].Followers.filter(
              (follower) => follower.id !== me?.user?.email,
            ),
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers - 1,
            },
          }
        }
        queryClient.setQueryData(['users', 'followRecommends'], shallow)
      }
      const userInfo: IUser | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      if (userInfo) {
        const shallow = {
          ...userInfo,
          Followers: [{ id: me?.user?.email as string }],
          _count: {
            ...userInfo._count,
            Followers: userInfo._count.Followers + 1,
          },
          // speard 문법은 객체(array,object)에만 가능합니다
        }
        queryClient.setQueryData(['users', userId], shallow)
      }
    },
  })
  const unFollow = useMutation({
    mutationFn: async (userId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: 'include',

          method: 'delete',
        },
      )
    },
    onMutate(userId) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      if (value) {
        const index = value.findIndex((user) => user.id === userId)
        const shallow = [...value]
        if (index > -1) {
          shallow[index] = {
            ...shallow[index],
            Followers: shallow[index].Followers.filter(
              (follower) => follower.id !== me?.user?.email,
            ),
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers - 1,
            },
          }
        }
        queryClient.setQueryData(['users', 'followRecommends'], shallow)
      }
      const userInfo: IUser | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      if (userInfo) {
        const shallow = {
          ...userInfo,
          Followers: userInfo.Followers.filter((v) => v.id !== me?.user?.email),
          _count: {
            ...userInfo._count,
            Followers: userInfo._count.Followers - 1,
          },
          // speard 문법은 객체(array,object)에만 하다
        }
        queryClient.setQueryData(['users', userId], shallow)
      }
    },

    onError(error, userId) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      // getQueryCache()는 모든 쿼리 캐시를 가져와주고 getQueryData는 쿼리키를 필수로 작성해줘야 하며 쿼리키에 따른 특정 데이터만 가져와줌
      if (value) {
        const index = value.findIndex((v) => v.id === userId)
        if (index > -1) {
          const shallow = [...value]
          shallow[index] = {
            ...shallow[index],
            Followers: [{ id: me?.user?.email as string }],
            _count: {
              ...shallow[index]._count,
              Followers: shallow[index]._count?.Followers + 1,
            },
          }
          queryClient.setQueryData(['users', 'followRecommends'], shallow)
        }
      }
      const userInfo: IUser | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      if (userInfo) {
        const shallow = {
          ...userInfo,
          Followers: [{ id: me?.user?.email as string }],
          _count: {
            ...userInfo._count,
            Followers: userInfo._count?.Followers + 1,
          },
        }
        queryClient.setQueryData(['users', userId], shallow)
      }
    },
  })

  const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (followed) {
      unFollow.mutate(username)
    } else {
      follow.mutate(username)
    }
  }
  const onMessage = () => {
    const ids = [me?.user?.email, user?.id]
    ids.sort()
    router.push(`/messages/${ids.join('-')}`)
  }
  // if (error) {
  //   return (
  //     <>
  //       <div className={style.header}>
  //         <BackButton />
  //         <h3 className={style.headerTitle}>프로필</h3>
  //       </div>
  //       <div className={style.userZone}>
  //         <div className={style.userImage} />
  //         <div className={style.userName}>
  //           <div>@{username}</div>
  //         </div>
  //       </div>
  //       <div className={style.notUserInfo}>계정이 존재하지 않음</div>
  //     </>
  //   )
  // }

  if (!user) {
    return null
  }
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
            <div>
              <div>{user?.nickname}</div>
              <div>@{user?.id}</div>
            </div>
            {me?.user?.email !== username && (
              <>
                <button
                  type="button"
                  className={style.messageButton}
                  onClick={onMessage}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    aria-hidden="true"
                    className="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-z80fyv r-19wmn03 "
                  >
                    <g>
                      <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v2.764l8 3.638 8-3.636V5.5c0-.276-.224-.5-.5-.5h-15zm15.5 5.463l-8 3.636-8-3.638V18.5c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.037z" />
                    </g>
                  </svg>
                </button>
                <button
                  type="button"
                  className={cx(
                    style.followButton,
                    followed && style.following,
                  )}
                  onClick={onFollow}
                >
                  {followed ? '팔로잉' : '팔로우'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className={style.userFollower}>
          <div>{user?._count.Followers} 팔로워</div>
          &nbsp;
          <div>{user?._count.Followings} 팔로우 중</div>
        </div>
      </div>
    </>
  )
}
