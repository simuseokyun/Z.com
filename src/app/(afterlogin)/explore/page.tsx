import { Suspense } from 'react'
import style from './explore.module.css'
import SearchForm from '../_component/SearchForm'
import Loading from '../home/loading'
import ExploreSuspense from './_component/ExploreSuspense'

export default async function Home() {
  return (
    <main className={style.main}>
      <div className={style.formZone}>
        <SearchForm />
      </div>
      <div className={style.trend}>
        <h3>나를 위한 트렌드</h3>
        <Suspense fallback={<Loading />}>
          <ExploreSuspense />
        </Suspense>
      </div>
    </main>
  )
}
