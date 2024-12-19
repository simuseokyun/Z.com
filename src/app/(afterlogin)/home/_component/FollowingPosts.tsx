import { useQuery } from '@tanstack/react-query';
import Post from '../../_component/Post';
import { Post as IPost } from '@/model/Post';
import { getFollowingPosts } from '../_lib/getFollowingPosts';
export default function FolloiwngPost() {
    // const { data } = useQuery<IPost[]>({
    //     queryKey: ['posts', 'follow'],
    //     queryFn: getFollowingPosts,
    //     staleTime: 60 * 1000,
    //     gcTime: 300 * 1000,
    // });
    // return data?.map((post) => {
    //     return <Post post={post}></Post>;
    // });
    return null;
}
