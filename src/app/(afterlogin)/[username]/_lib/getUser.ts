export const getUser = async ({ queryKey }: { queryKey: string[] }) => {
    const [_, username] = queryKey;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${username}`, {
        next: { tags: ['users', username] },
        credentials: 'include',
    });
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data');
    }
    return await res.json();
};
