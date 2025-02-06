import { Metadata, ResolvingMetadata } from 'next'

import SearchForm from '../_component/SearchForm'
import Tab from './_component/Tab'
import style from './search.module.css'
import SearchResult from './_component/SearchResult'
import BackButton from '../_component/BackButton'

type Props = {
  searchParams: Promise<{ q: string; f?: string; pf?: string }>
}

// default는 기본이란 뜻이고 파일당 한개의 컴포넌트만 사용가능. default가 붙으면 다른 파일에서 임의로 이름을 정의해서 가져올 수 있음
export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { q } = await searchParams
  const parentMetadata = await parent // parent는 부모 레이아웃을 의미하고 부모 레이아웃의 메타데이터 title/description 을 가져올 수 있다. parent는 항상 두 번째 매개변수임
  console.log(parentMetadata.title, parentMetadata.description)

  return {
    title: `${q} - 검색 / Z`,
    description: `${q} - 검색 / Z`,
  }
}
export default async function Search({ searchParams }: Props) {
  const query = await searchParams
  // page.tsx 에서만 next에서 지원하는 searchParams를 받을 수 있음 / 다른 컴포넌트에서 필요하다면 Props로 넘겨줘야 함
  return (
    <main className={style.main}>
      <div className={style.searchTop}>
        <div className={style.searchZone}>
          <div className={style.buttonZone}>
            <BackButton />
          </div>
          <div className={style.formZone}>
            <SearchForm q={query.q} f={query.f} pf={query.pf} />
          </div>
        </div>
        <Tab />
      </div>
      <div className={style.list}>
        <SearchResult searchParams={query} />
      </div>
    </main>
  )
}
