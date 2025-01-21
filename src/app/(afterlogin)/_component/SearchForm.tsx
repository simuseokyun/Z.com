import style from '@/app/(afterLogin)/_component/rightSearchZone.module.css';

type Props = { q?: string; pf?: string; f?: string };
export default function SearchForm({ q, pf, f }: Props) {
    return (
        <form action="/search" className={style.search}>
            {/* /search 로 되어있지만 HTML 폼 제출 방식에 따라 쿼리 파라미터가 자동으로 URL에 추가됩니다. */}
            <svg width={20} viewBox="0 0 24 24" aria-hidden="true">
                <g>
                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
                </g>
            </svg>
            <input type="search" name="q" defaultValue={q} />
            {/* form을 제출하게 되면 모든 input의 내용을 폼으로 전송하게 됨 / 따라서 시각적으론 필요없는 input이지만 pf와 f를 전달하기위해 type을 hidden으로 만들어서 같이 전송 */}
            <input type="hidden" name="pf" defaultValue={pf} />
            <input type="hidden" name="f" defaultValue={f} />
        </form>
    );
}
