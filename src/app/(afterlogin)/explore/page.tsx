import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'

import style from './explore.module.css'
import SearchForm from '../_component/SearchForm'
import TrendSection from './_component/TrendSection'
import getTrends from '../_lib/getTrends'

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['trends'],
    queryFn: getTrends,
  })
  const dehydratedState = dehydrate(queryClient)
  return (
    <main className={style.main}>
      <div className={style.formZone}>
        <SearchForm />
      </div>
      <div className={style.trend}>
        <h3>나를 위한 트렌드</h3>
        <HydrationBoundary state={dehydratedState}>
          <TrendSection />
        </HydrationBoundary>
      </div>
    </main>
  )
}
