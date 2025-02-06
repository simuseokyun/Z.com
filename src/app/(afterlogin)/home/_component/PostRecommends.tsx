// 'use client';

// import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query';
// import { getPostRecommends } from '../_lib/getPostRecommend';
// import Post from '@/app/(afterLogin)/_component/Post';
// import { Post as IPost } from '@/model/Post';
// import { Fragment, useEffect } from 'react';
// import { useInView } from 'react-intersection-observer';
// import styles from '@/app/(afterLogin)/home/home.module.css';

// export default function PostRecommends() {
//     const { data, hasNextPage, fetchNextPage, isFetching, isPending } = useSuspenseInfiniteQuery<
//         //useInfiniteQuery와 useSuspenseInfiniteQuery의 차이점은 React Query의 기본 동작과 Suspense API 사용 여부에 있습니다. 두 훅은 유사한 역할을 하지만 Suspense를 사용하는지에 따라 동작 방식과 코드 작성 스타일이 달라집니다.

//         // useInfiteQuery는 로딩 상태(isLoading, isFetching, isError)를 직접 처리해야 함
//         // useSuspenseInfiniteQuery를 사용하면 Suspense / ErrorBoundry의 fallback부분에 에러나 로딩 컴포넌트를 넣어줄 수 있음
//         IPost[],
//         Object,
//         InfiniteData<IPost[]>,
//         [_1: string, _2: string],
//         number
//     >({
//         queryKey: ['posts', 'recommends'],
//         queryFn: getPostRecommends,
//         initialPageParam: 0,

//         // parseInt는 문자열을 정수로 변환하는 함수 / 문자열과 숫자가 섞여있으면 바꿀 수 있는 것만 반환 / 정수로 변환할 수 없으면 NaN반환
//         getNextPageParam: (lastPage) => {
//             console.log(lastPage, lastPage[lastPage.length - 1].postId);
//             return lastPage.at(-1)?.postId;
//         },

//         staleTime: 60 * 1000, // staleTime이 지나고 화면이 다시 랜더링되거나 refetch될 경우 다시 가져옴 => 가져온 데이터는 캐시에 저장됨
//         gcTime: 70 * 1000, // gcTime은 데이터가 캐시에 머물 수 있는 최대 시간
//         // refetchInterval: 5000, refetchInterval은 새로고침하지 않아도 자동으로 데이터를 갱신해서 UI를 변경해줌
//     });
//     // console.log(data);

//     const { ref, inView } = useInView({
//         threshold: 0.5,
//         // triggerOnce: false, 기본값은 false이고 true로 하면 무조~~건 inView가 true가 된 즉시 상태변화 일어나지 않음 (true로 계속 남아있게 됨) => 데이터를 단 한번만 받아와야 될때 사용
//         delay: 200,
//     });

//     useEffect(() => {
//         //    inView가 true로 될 때만 실행됨
//         if (inView && hasNextPage && !isFetching) {
//             fetchNextPage();
//         }
//     }, [inView]);

//     if (isPending) {
//         return (
//             <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 <svg className={styles.loader} height="100%" viewBox="0 0 32 32" width={40}>
//                     <circle
//                         cx="16"
//                         cy="16"
//                         fill="none"
//                         r="14"
//                         strokeWidth="4"
//                         style={{ stroke: 'rgb(29, 155, 240)', opacity: 0.2 }}
//                     ></circle>
//                     <circle
//                         cx="16"
//                         cy="16"
//                         fill="none"
//                         r="14"
//                         strokeWidth="4"
//                         style={{ stroke: 'rgb(29, 155, 240)', strokeDasharray: 80, strokeDashoffset: 60 }}
//                     ></circle>
//                 </svg>
//             </div>
//         );
//     }

//     return (
//         <>
//             {data?.pages.map((page, i) => (
//                 <Fragment key={i}>
//                     {page.map((post) => (
//                         <Post key={post.postId} post={post} />
//                     ))}
//                 </Fragment>
//             ))}
//             <div ref={ref} style={{ height: 50, background: 'red' }} />
//         </>
//     );
// }

'use client'

import { InfiniteData, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { Fragment, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import Post from '@/app/(afterLogin)/_component/Post'
import { Post as IPost } from '@/model/Post'
import styles from '@/app/(afterLogin)/home/home.module.css'

import getPostRecommends from '../_lib/getPostRecommend'

export default function PostRecommends() {
  const { data, hasNextPage, fetchNextPage, isFetching, isPending } =
    useSuspenseInfiniteQuery<
      IPost[],
      unknown,
      InfiniteData<IPost[]>,
      [_1: string, _2: string],
      number
    >({
      queryKey: ['posts', 'recommends'],
      queryFn: getPostRecommends,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
      staleTime: 60 * 1000,
      gcTime: 120 * 1000,
      // staleTime/gcTime 명시하지않으면 계속 데이터 요청
    })

  const { ref, inView } = useInView({
    threshold: 0, // 얼마정도 드러나야 실행할건지 0 ~ 1 사이값
    delay: 0,
  })

  useEffect(() => {
    if (inView) {
      if (!isFetching && hasNextPage) {
        fetchNextPage()
      }
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage])

  if (isPending) {
    return (
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg
          className={styles.loader}
          height="100%"
          viewBox="0 0 32 32"
          width={40}
        >
          <circle
            cx="16"
            cy="16"
            fill="none"
            r="14"
            strokeWidth="4"
            style={{
              stroke: 'rgb(29, 155, 240)',
              opacity: 0.2,
            }}
          />
          <circle
            cx="16"
            cy="16"
            fill="none"
            r="14"
            strokeWidth="4"
            style={{
              stroke: 'rgb(29, 155, 240)',
              strokeDasharray: 80,
              strokeDashoffset: 60,
            }}
          />
        </svg>
      </div>
    )
  }

  return (
    <>
      {data?.pages.map((page) => (
        <Fragment key={page[0].postId}>
          {page.map((post) => (
            <Post key={post.postId} post={post} />
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }} />
    </>
  )
}
