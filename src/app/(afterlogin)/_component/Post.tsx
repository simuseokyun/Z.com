import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ko'
import { MouseEventHandler } from 'react'
import type { Post as IPost } from '@/model/Post'
import PostImages from './PostImages'
import PostArticle from './PostArticle'
import ActionButtons from './ActionButtons'
import style from './post.module.css'
import RepostIcon from './RepostIcon'

dayjs.locale('ko')
dayjs.extend(relativeTime)

type Props = {
  post: IPost
  noImage?: boolean
}
export default function Post({ post, noImage }: Props) {
  let target = post
  if (post && post.Original) {
    target = post.Original
  }

  const stopPropagation: MouseEventHandler = (e) => {
    e.stopPropagation()
  }

  return (
    <PostArticle post={target}>
      {post.Original && (
        <div className={style.postReposted}>
          <RepostIcon />
          {post.User.nickname}님이 재게시했습니다
        </div>
      )}

      <div className={style.postWrapper}>
        <div className={style.postUserSection}>
          <Link
            href={`/${target.User.id}`}
            className={style.postUserImage}
            onClick={stopPropagation}
          >
            <img src={target.User.image} alt={target.User.nickname} />
            <div className={style.postShade} />
          </Link>
        </div>
        <div className={style.postBody}>
          <div className={style.postMeta}>
            <Link href={`/${target.User.id}`} onClick={stopPropagation}>
              <span className={style.postUserName}>{target.User.nickname}</span>
              &nbsp;
              <span className={style.postUserId}>@{target.User.id}</span>
              &nbsp; · &nbsp;
            </Link>
            <span className={style.postDate}>
              {dayjs(target.createdAt).fromNow(true)}
            </span>
          </div>
          {target.Parent && (
            <div>
              <Link
                href={`/${target.Parent.User.id}`}
                style={{ color: 'rgb(29, 155, 240)' }}
                onClick={stopPropagation}
              >
                @{target.Parent.User.nickname}
              </Link>
              님에게 보내는 답글
            </div>
          )}
          <div>{target.content}</div>
          {target.Images && !noImage && (
            <div>
              <PostImages post={target} />
            </div>
          )}
          <ActionButtons post={post} />
        </div>
      </div>
    </PostArticle>
  )
}
