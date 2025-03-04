import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import style from './photoModal.module.css'
import SinglePost from '@/app/(afterLogin)/[username]/status/[postId]/_component/SinglePost'
import CommentForm from '@/app/(afterLogin)/[username]/status/[postId]/_component/CommentForm'
import Comments from '@/app/(afterLogin)/[username]/status/[postId]/_component/Comments'
import getSinglePostServer from '@/app/(afterLogin)/[username]/status/[postId]/_lib/getSinglePostServer'
import getComments from '@/app/(afterLogin)/[username]/status/[postId]/_lib/getComments'
import ImageZone from './_component/ImageZone'
import PhotoModalCloseButton from './_component/PhotoModalCloseButton'

interface Props {
  params: Promise<{ postId: string }>
}
export default async function Page({ params }: Props) {
  const { postId } = await params
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['posts', postId],
    queryFn: getSinglePostServer,
  })
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: getComments,
    initialPageParam: 0,
    // 마찬가지로 최초 렌더링이기에 getNextPageParam 명시안해줘도 됨
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <div className={style.container}>
      <HydrationBoundary state={dehydratedState}>
        <PhotoModalCloseButton />
        <ImageZone id={postId} />
        <div className={style.commentZone}>
          <SinglePost id={postId} noImage />
          <CommentForm id={postId} />
          <Comments id={postId} />
        </div>
      </HydrationBoundary>
    </div>
  )
}
