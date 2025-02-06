/* eslint-disable no-unsafe-optional-chaining */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { MouseEventHandler } from 'react'
import cx from 'classnames'
import { User } from '@/model/User'

import style from './followRecommend.module.css'

type Props = { user: User }
export default function FollowRecommend({ user }: Props) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  // useQueryClient는 React Query에서 제공하는 훅으로, 쿼리 클라이언트에 접근할 수 있게 해줍니다.
  // useQueryClient 훅을 사용하면 쿼리 클라이언트의 기능을 직접 사용하여, 쿼리 캐시를 업데이트하거나, 새로운 쿼리를 프리패치(pre-fetch)하거나, 캐시에서 데이터를 삭제하는 등의 작업을 할 수 있습니다.
  const followed = !!user.Followers?.find((v) => v.id === session?.user?.email) // !!은 이중부정이란 뜻으로 값을 boolean값으로 변환함, !은 단일부정으로 boolean값으로 바꾸되 부정하는 것
  const follow = useMutation({
    mutationFn: (userId: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          method: 'post',

          credentials: 'include',
        },
      )
    },
    onMutate(userId: string) {
      // onMutate는 하트누르기와 같은 옵티미스틱 적용을 할때 사용하고 onSuccess는 성공했을때만 동작하게
      const value: User[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      if (value) {
        const index = value.findIndex((a) => a.id === userId)
        const shallow = [...value]
        shallow[index] = {
          ...shallow[index],
          Followers: [{ id: session?.user?.email as string }],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        }
        queryClient.setQueryData(['users', 'followRecommends'], shallow)
      }
      const value2: User | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      // console.log(value2);
      if (value2) {
        const shallow = {
          ...value2,
          Followers: [{ id: session?.user?.email }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        }
        queryClient.setQueryData(['users', session?.user?.email], shallow)
      }
    },
    onError(error, userId: string) {
      // onError영역의 첫 번째 파라미터는 무조건 error
      const value: User[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      if (value) {
        const index = value.findIndex((a) => a.id === userId)
        const shallow = [...value]
        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v) => v.id !== session?.user?.email,
          ),
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        }
        queryClient.setQueryData(['users', 'followRecommends'], shallow)
      }

      const value2: User | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      if (value2) {
        const shallow = {
          ...value2,
          Followers: value2.Followers.filter(
            (v) => v.id !== session?.user?.email,
          ),
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers - 1,
          },
        }
        queryClient.setQueryData(['users', userId], shallow)
      }
    },
  })
  const unfollow = useMutation({
    mutationFn: (userId: string) => {
      // console.log('unfollow', userId);
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: 'include',
          method: 'delete',
        },
      )
    },
    onMutate(userId: string) {
      const value: User[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      if (value) {
        const index = value.findIndex((a) => a.id === userId)
        const shallow = [...value]
        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v) => v.id !== session?.user?.email,
          ),
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        }
        queryClient.setQueryData(['users', 'followRecommends'], shallow)
      }
      const value2: User | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      if (value2) {
        const shallow = {
          ...value2,
          Followers: value2.Followers.filter(
            (v) => v.id !== session?.user?.email,
          ),
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers - 1,
          },
        }
        queryClient.setQueryData(['users', userId], shallow)
      }
    },
    onError(error, userId) {
      const value: User[] | undefined = queryClient.getQueryData([
        'users',
        'followRecommends',
      ])
      if (value) {
        const index = value.findIndex((a) => a.id === userId)
        const shallow = [...value]
        shallow[index] = {
          ...shallow[index],
          Followers: [{ id: session?.user?.email as string }],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        }
        queryClient.setQueryData(['users', 'followRecommends'], shallow)
      }
      const value2: User | undefined = queryClient.getQueryData([
        'users',
        userId,
      ])
      // console.log(value2);
      if (value2) {
        const shallow = {
          ...value2,
          Followers: [{ id: session?.user?.email }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        }
        queryClient.setQueryData(['users', session?.user?.email], shallow)
      }
    },
  })
  const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation() // e.stopPropagation()은 이벤트가 상위 요소로 전파되는 것을 중단합니다. / 이벤트 버블링을 중단하는 데 사용됩니다.
    e.preventDefault() // e.preventDefault()는 이벤트의 기본 동작을 막습니다. / 주로 양식 제출, 링크 클릭, 드래그 앤 드롭 등의 기본 동작을 막는 데 사용됩니다.

    if (followed) {
      unfollow.mutate(user.id)
    } else {
      follow.mutate(user.id)
    }
  }

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
      <div
        className={cx(style.followButtonSection, followed && style.following)}
      >
        <button type="button" onClick={onFollow}>
          {followed ? '팔로잉' : '팔로우'}
        </button>
      </div>
    </div>
  )
}
