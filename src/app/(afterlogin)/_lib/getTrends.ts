export async function getTrends() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/hashtags/trends`, {
        next: {
            tags: ['trends'],
        },

        credentials: 'include', // 로그인 해야 데이터를 가져올 수 있다면 이 코드 넣어주기aa넹ㅁㄴㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}
