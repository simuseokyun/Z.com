'use client';
import Post from '@/app/(afterlogin)/_component/Post';
import { getSinglePost } from '../_lib/getSinglePost';
import { useQuery } from '@tanstack/react-query';
export default function SinglePost({ id, noImage }: { id: string; noImage?: boolean }) {
    const { data, error } = useQuery({
        queryKey: ['post', id],
        queryFn: getSinglePost,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
    });
    if (error) {
        return (
            <div
                style={{
                    height: 100,
                    alignItems: 'center',
                    fontSize: 31,
                    fontWeight: 'bold',
                    justifyContent: 'center',
                    display: 'flex',
                }}
            >
                게시글을 찾을 수 없습니다.
            </div>
        );
    }
    if (!data) {
        return null;
    }
    return <Post post={data} noImage={noImage} />;
}
