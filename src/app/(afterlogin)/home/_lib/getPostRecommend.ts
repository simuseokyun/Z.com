type Props = { pageParam?: number }

async function getPostRecommends({ pageParam }: Props) {
  // pageParam은 React Query에서 useInfiniteQuery를 사용할 때 페이지네이션을 위한 getNextPageParam과 함께 사용되는 파라미터입니다.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/recommends?cursor=${pageParam}`,
    {
      next: {
        tags: ['posts', 'recommends'],
      },
      credentials: 'include',
    },
  )
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getPostRecommends
