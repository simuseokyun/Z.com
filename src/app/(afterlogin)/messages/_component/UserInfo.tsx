'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import style from '@/app/(afterLogin)/messages/[room]/chatRoom.module.css'
import BackButton from '@/app/(afterLogin)/_component/BackButton'
import getUser from '@/app/(afterLogin)/[username]/_lib/getUser'
import { User } from '@/model/User'

interface Props {
  id: string
}
function UserInfo({ id }: Props) {
  const { data: user } = useQuery<User, Error, User, [string, string]>({
    queryKey: ['users', id],
    queryFn: getUser,
    enabled: !!id,
  })

  if (!user) {
    return null
  }
  return (
    <>
      <div className={style.header}>
        <BackButton />
        <div>
          <h2>{user.nickname}</h2>
        </div>
      </div>
      <Link href={`/${user.id}`} className={style.userInfo}>
        <img src={user.image} alt={user.id} />
        <div>
          <b>{user.nickname}</b>
        </div>
        <div>@{user.id}</div>
      </Link>
    </>
  )
}
export default UserInfo
