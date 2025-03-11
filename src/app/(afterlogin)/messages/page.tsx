import { QueryClient, dehydrate } from '@tanstack/query-core'
import { HydrationBoundary } from '@tanstack/react-query'
import style from './message.module.css'
import { auth } from '@/auth'
import Rooms from './_component/Rooms'
import getRoomsServer from './_lib/getRoomsServer'

export default async function Page() {
  const session = await auth()
  const queryClient = new QueryClient()

  if (session?.user?.email) {
    await queryClient.prefetchQuery({
      queryKey: ['room'],
      queryFn: () => getRoomsServer(session?.user?.email as string),
    })
  }

  const dehydrateState = dehydrate(queryClient)
  return (
    <main className={style.main}>
      <div className={style.header}>
        <h3>쪽지</h3>
      </div>
      <HydrationBoundary state={dehydrateState}>
        <Rooms me={session} />
      </HydrationBoundary>
    </main>
  )
}
