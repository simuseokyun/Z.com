import BackButton from '@/app/(afterLogin)/_component/BackButton'
import { Metadata } from 'next'
import { User } from '@/model/User'
import { Post as IPost } from '@/model/Post'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'

import style from './singlePost.module.css'
import Comments from './_component/Comments'
// import CommentForm from '@/app/(afterLogin)/[username]/status/[id]/_component/CommentForm';
import { getUserServer } from '../../_lib/getUserServer'
import { getSinglePostServer } from './_lib/getSinglePostServer'
import { getComments } from './_lib/getComments'
import CommentForm from './_component/CommentForm'
import SinglePost from './_component/SinglePost'

type Props = {
  params: Promise<{ postId: string; username: string }>
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username, postId } = await params
  const [user, post]: [User, IPost] = await Promise.all([
    getUserServer({ queryKey: ['users', username] }),
    getSinglePostServer({ queryKey: ['posts', postId] }),
  ])
  return {
    title: `Z에서 ${user.nickname} 님 : ${post.content}`,
    description: post.content,
  }
}
interface Props2 {
  params: { username: string; postId: string }
}

export default async function Page({ params }: Props2) {
  const { username, postId } = await params
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['posts', postId],
    queryFn: getSinglePostServer,
  })
  await queryClient.prefetchQuery({
    queryKey: ['posts', postId, 'comments'],
    queryFn: getComments,
  })
  const dehydrateState = dehydrate(queryClient)

  return (
    <div className={style.main}>
      <HydrationBoundary state={dehydrateState}>
        <div className={style.header}>
          <BackButton />
          <h3 className={style.headerTitle}>게시하기</h3>
        </div>
        <SinglePost id={postId} />
        <CommentForm id={postId} />
        <Comments id={postId} />
      </HydrationBoundary>
    </div>
  )
}
