// type Props = { pageParam?: number };
// export async function getPostRecommends({ pageParam }: Props) {
//     console.log(pageParam);

//     const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/recommends?cursor=${pageParam}`, {
//         next: {
//             tags: ['posts', 'recommends'],
//         },

//         cache: 'force-cache', // force-cache 는 캐시를 사용하겠다
//     });

//     // console.log(await res.json());

//     if (!res.ok) {
//         throw new Error('Failed to fetch data');
//     }

//     return res.json();
// }

type Props = { pageParam?: number };
export async function getPostRecommends({ pageParam }: Props) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/recommends?cursor=${pageParam}`, {
        next: {
            tags: ['posts', 'recommends'],
        },
        // cache: 'force-cache',force-cache 같은 경우는 캐시가 있는 경우 네트워크 요청을 하지않고 캐시 데이터만 가져다 씀. 그래서 데이터가 바뀌지 않는 정적파일들에 보통 적용
        // staleTime 과 gcTime 이 지나도 데이터를 새로 요청하지 않음

        // 브라우저 캐시와 ReactQuery캐시는 다른 레이어에서 작동함
        // 이 함수는 브라우저캐시 / 이 함수를 사용하는 PostRecommend에서의 useQuery는 리액트쿼리캐시
    });
    console.log(res);

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
}
