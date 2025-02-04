type Props = { pageParam?: number };
export async function getFollowingPosts({ pageParam }: Props) {
    // pageParam은 React Query에서 useInfiniteQuery를 사용할 때 페이지네이션을 위한 getNextPageParam과 함께 사용되는 파라미터입니다.
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/followings?cursor=${pageParam}`, {
        next: {
            tags: ['posts', 'followings'],
        },
        credentials: 'include',
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}
