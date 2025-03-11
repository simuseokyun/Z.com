'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import Post from '@/app/(afterLogin)/_component/Post'

import getSinglePost from '../_lib/getSinglePost'

type Props = {
  id: string
  noImage?: boolean
}
export default function SinglePost({ id, noImage }: Props) {
  const { data: post } = useSuspenseQuery({
    queryKey: ['posts', id],
    queryFn: getSinglePost,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  })

  if (!post) {
    return null
  }
  return <Post key={post.postId} post={post} noImage={noImage} />
}
