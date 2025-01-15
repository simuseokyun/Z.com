'use client';

import { useQuery } from '@tanstack/react-query';
import { getComments } from '../_lib/getComments';
import Post from '@/app/(afterlogin)/_component/Post';
import { Post as IPost } from '@/model/Post';
import { useQueryClient } from '@tanstack/react-query';
type Props = {
    id: string;
};
export default function Comments({ id }: Props) {
    const queryClient = useQueryClient();
    const post = queryClient.getQueryData(['posts', id]);
    const { data, error } = useQuery<IPost[], Object, IPost[], [_1: string, _2: string, _3: string]>({
        queryKey: ['posts', id, 'comments'],
        queryFn: getComments,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        enabled: !!post,
    });
    if (post) {
        return data?.map((post) => <Post key={post.postId} post={post} />);
    }
    return null;
}
