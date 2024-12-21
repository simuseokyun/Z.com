import { QueryFunction } from '@tanstack/query-core';
import { Post } from '@/model/Post';

export const getUserPosts = async ({
    queryKey,
    pageParam,
}: {
    queryKey: string[]; // queryKey의 타입을 지정
    pageParam?: number;
}) => {
    const [_1, _2, username] = queryKey;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${username}/posts?cursor=${pageParam}`, {
        next: {
            tags: ['posts', 'users', username],
        },
        credentials: 'include',
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return res.json();
};
