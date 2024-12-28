'use client';

import { useQuery } from '@tanstack/react-query';
import { getComments } from '../_lib/getComments';
import Post from '@/app/(afterlogin)/_component/Post';
export default function Comments({ id }: { id: string }) {
    const { data } = useQuery({
        queryKey: ['posts', id, 'comments'],
        queryFn: getComments,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
    });

    if (data) {
        return data?.map((post) => <Post post={post} key={post.postId} />);
    }
    return null;
}
