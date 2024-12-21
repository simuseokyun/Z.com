import style from './post.module.css';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import ActionButtons from '@/app/(afterlogin)/_component/ActionButtons';
import PostArticle from '@/app/(afterlogin)/_component/PostArticle';
import { faker } from '@faker-js/faker';
import PostImages from '@/app/(afterlogin)/_component/PostImages';
import { Post as IPost } from '@/model/Post';

dayjs.locale('ko');
dayjs.extend(relativeTime);

type Props = {
    noImage?: boolean;
    post: IPost;
};

export default function Post({ noImage, post }: Props) {
    return (
        <PostArticle post={post}>
            <div className={style.postWrapper}>
                <div className={style.postUserSection}>
                    <Link href={`/${post.User.id}`} className={style.postUserImage}>
                        <img src={post.User.image} />
                        <div className={style.postShade} />
                    </Link>
                </div>
                <div className={style.postBody}>
                    <div className={style.postMeta}>
                        <Link href={`/${post.User.id}`}>
                            <span className={style.postUserName}>{post.User.nickname}</span>
                            &nbsp;
                            <span className={style.postUserId}>@{post.User.id}</span>
                            &nbsp; · &nbsp;
                        </Link>
                        <span className={style.postDate}>{dayjs(post.createdAt).fromNow(true)}</span>
                    </div>
                    <div>{post.content}</div>
                    {!noImage && (
                        <div>
                            <PostImages post={post} />
                        </div>
                    )}
                    <ActionButtons />
                </div>
            </div>
        </PostArticle>
    );
}
