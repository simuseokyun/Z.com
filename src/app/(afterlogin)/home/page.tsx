import { Suspense } from 'react'
import { Metadata } from 'next'

import Tab from '@/app/(afterLogin)/home/_component/Tab'
import PostForm from '@/app/(afterLogin)/home/_component/PostForm'
import { auth } from '@/auth'
import Loading from './loading'
import TabDeciderSuspense from './_component/TabDeciderSuspense'
import style from './home.module.css'

export const metadata: Metadata = {
  title: '홈 / Z',
  description: '홈',
}

// 서버 컴포넌트에서 초기 렌더링같은 경우는 이미 서버에서 HTML을 만들어서 받아오기 때문에 로딩이 안뜸 => 난 초기렌더링도 띄우고싶다 ? 그럼 prefetchQuery 사용 X (검색엔진 최적화에 불리하다)

export default async function Home() {
  const session = await auth()
  return (
    <main className={style.main}>
      <Tab />
      <PostForm me={session} />

      {/* next는 기본적으로 Suspense가 기본 적용되어있어서 쓰지않아도 상관없지만 이 경우는 TabDeciderSuspense가 서버컴포넌트라 page전체에 로딩이 걸림. 이 경우 서버컴포넌트를 Suspense로 직접 감싸주면 로딩이 필요하지 않은 부분부터 부분 렌더링 가능 (Streaming) */}

      {/* 정리하자면 page 자체는 loading.tsx
       서버컴포넌트는 Suspense 컴포넌트의 fallback
      클라이언트 컴포넌트는 react-query의 isLoading */}

      <Suspense fallback={<Loading />}>
        <TabDeciderSuspense />
      </Suspense>
    </main>
  )
}
