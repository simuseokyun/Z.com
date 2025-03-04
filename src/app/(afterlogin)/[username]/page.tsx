import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import { User } from '@/model/User'
import { auth } from '@/auth'
import Loading from '../home/loading'
import getUserPosts from './_lib/getUserPosts'
import getUserServer from './_lib/getUserServer'
import UserInfo from './_component/UserInfo'
import style from './profile.module.css'
import UserPosts from './_component/UserPosts'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  // Promise<{ username: string }>는 Promise 객체를 반환하는 비동기 작업의 결과가 특정한 형태의 객체라는 것을 나타냅니다.
  const { username } = await params

  const user: User = await getUserServer({ queryKey: ['users', username] })
  return {
    title: `${user.nickname} 프로필`,
    describe: `${user.nickname} 프로필에 오신걸 환영합니다`,
  }
}
export default async function Profile({
  params,
}: {
  params: { username: string }
}) {
  const { username } = await params
  // params의 값이 영어가 아니라면 (한글이나 특수문자) 자동으로 인코딩된 값이 나옴 / ex : #224#@!24214 => 따라서 decodeURIComponent를 통해 디코딩해줘야 함
  const session = await auth()
  const decodeUsername = decodeURIComponent(username)
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['users', decodeUsername],
    queryFn: getUserServer,
  })
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', 'users', decodeUsername],
    queryFn: getUserPosts,
    initialPageParam: 0,
    // 초기 렌더링에만 쓰이므로 getNextPageParam는 명시하지 않아도 됨
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <main className={style.main}>
      <Suspense fallback={<Loading />}>
        <HydrationBoundary state={dehydratedState}>
          <UserInfo username={decodeUsername} me={session} />
          <UserPosts username={decodeUsername} />
        </HydrationBoundary>
      </Suspense>
    </main>
  )
}
