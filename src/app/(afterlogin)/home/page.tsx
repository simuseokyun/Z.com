import { Suspense } from 'react'
import { Metadata } from 'next'
import Tab from '@/app/(afterLogin)/home/_component/Tab'
import TabProvider from '@/app/(afterLogin)/home/_component/TabProvider'
import PostForm from '@/app/(afterLogin)/home/_component/PostForm'
import { auth } from '@/auth'

import Loading from './loading'
import TabDeciderSuspense from './_component/TabDeciderSuspense'
import style from './home.module.css'

export const metadata: Metadata = {
  title: '홈 / Z',
  description: '홈',
}

export default async function Home() {
  const session = await auth()
  return (
    <main className={style.main}>
      <TabProvider>
        <Tab />
        <PostForm me={session} />
        <Suspense fallback={<Loading />}>
          <TabDeciderSuspense />
        </Suspense>
      </TabProvider>
    </main>
  )
}
