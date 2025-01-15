'use client';
import { useSession } from 'next-auth/react';
import style from './post.module.css';
import cx from 'classnames';
import { Post } from '@/model/Post';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useModalState } from '@/store/modal';
import { MouseEventHandler } from 'react';
import { InfiniteData } from '@tanstack/react-query';

type Props = {
    white?: boolean;
    post: Post;
};
export default function ActionButtons({ white, post }: Props) {
    const { data } = useSession();
    const { setMode, setData } = useModalState();
    const modalStore = useModalState();
    const parent = modalStore.data;
    const router = useRouter();
    const queryClient = useQueryClient();
    // useQueryClient()는 React Query에서 QueryClient 인스턴스를 가져오는 훅입니다. 이 훅은 React Query의 캐시와 관련된 여러 작업을 수행하는 데 사용됩니다. useQueryClient()를 통해 React Query의 Query Client를 직접 다룰 수 있으며, 이를 통해 쿼리 데이터를 가져오거나, 업데이트하거나, 무효화하는 등의 다양한 작업을 할 수 있습니다.

    // 1. getQueryData(안에 쿼리키 넣어줘야 함)
    // 설명: 주어진 쿼리 키에 해당하는 데이터를 반환합니다.

    // 2. setQueryData(쿼리키,수정할 데이터 넣어주기)
    // 설명: 특정 쿼리 키에 데이터를 설정합니다. 주로 쿼리 데이터를 수동으로 업데이트할 때 사용합니다.

    // 3.invalidateQueries(쿼리키)
    // 설명: 특정 쿼리 키 또는 쿼리 키 패턴에 해당하는 모든 쿼리를 무효화하고, 재요청하도록 설정합니다. 보통 쿼리 데이터를 변경한 후 이를 다시 가져오도록 할 때 사용합니다. queryClient.invalidateQueries(["쿼리키"])
    const commented = !!post?.Comments?.find((comment) => comment.userId === data?.user?.id);
    const reposted = !!post?.Reposts?.find((Repost) => Repost.userId === data?.user?.id);
    const liked = !!post?.Hearts?.find((v) => v.userId === data?.user?.email);

    const Heart = useMutation({
        mutationFn: () => {
            return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${post.postId}/heart`, {
                method: 'post',
                credentials: 'include',
            });
        },
        onMutate() {
            const queryCache = queryClient.getQueryCache(); // getQueryCache는 모든 쿼리값 가져오는 메서드
            const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
            console.log(queryKeys);
            queryKeys.forEach((queryKey, i) => {
                if (queryKey[0] === 'posts') {
                    console.log(queryKey);
                    const value: Post | InfiniteData<Post[]> | undefined = queryClient.getQueryData(queryKey);
                }
            });
        },
        onError() {},
    });
    const onClickComment: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        setMode('댓글');
        setData(post);
        router.push('/compose/tweet');
    };
    const onClickRepost: MouseEventHandler<HTMLButtonElement> = (e) => e.stopPropagation();
    {
    }
    const onClickHeart: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation();
        Heart.mutate();
    };

    return (
        <div className={style.actionButtons}>
            <div className={cx(style.commentButton, { [style.commented]: commented }, white && style.white)}>
                <button onClick={onClickComment}>
                    <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
                        </g>
                    </svg>
                </button>
                <div className={style.count}>{post?._count?.Comments}</div>
            </div>
            <div className={cx(style.repostButton, reposted && style.reposted, white && style.white)}>
                <button onClick={onClickRepost}>
                    <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
                        </g>
                    </svg>
                </button>
                <div className={style.count}>{post?._count?.Reposts}</div>
            </div>
            <div className={cx([style.heartButton, liked && style.liked, white && style.white])}>
                <button onClick={onClickHeart}>
                    <svg width={24} viewBox="0 0 24 24" aria-hidden="true">
                        <g>
                            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                        </g>
                    </svg>
                </button>
                <div className={style.count}>{post?._count?.Hearts}</div>
            </div>
        </div>
    );
}
