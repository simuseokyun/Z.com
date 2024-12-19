import SearchForm from '../_component/SearchForm';
import Tab from '../home/_component/Tab';
import style from './search.module.css';
import SearchResult from './_component/SearchResult';
import BackButton from '../_component/BackButton';

type Props = {
    searchParams: Promise<{ q: string; f?: string; pf?: string }>;
};
export default async function Search({ searchParams }: Props) {
    const query = await searchParams;
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
    );
}
