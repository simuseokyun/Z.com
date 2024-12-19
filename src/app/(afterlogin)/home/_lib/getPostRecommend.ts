export async function getPostRecommends() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/Recommends`, {
        next: {
            tags: ['posts', 'recommends'],
            revalidate: 60,
        },
        // cache:"no-store"가 기본 값이고 캐싱되게 하고싶다면 "force-cache"
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }

    return res.json();
}
