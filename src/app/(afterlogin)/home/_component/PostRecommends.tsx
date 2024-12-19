import { useQuery } from '@tanstack/react-query';
import { getPostRecommends } from '../_lib/getPostRecommend';
import { Post as IPost } from '@/model/Post';
import Post from '../../_component/Post';

export default function PostRecommends() {
    const { data } = useQuery<IPost[]>({ queryKey: ['post', 'recommend'], queryFn: getPostRecommends });
    return data?.map((post) => {
        return <Post post={post}></Post>;
    });
}
