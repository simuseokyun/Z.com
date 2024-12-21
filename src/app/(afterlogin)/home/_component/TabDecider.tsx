'use client';

import { TabContext } from '@/app//(afterlogin)/home/_component/TabProvider';
import PostRecommends from './PostRecommends';
import FolloiwngPosts from './FollowingPosts';
import { useTabState } from '@/store/tab';

export default function TabDecider() {
    const tab = useTabState((state) => state.mode);

    if (tab === 'rec') {
        return <PostRecommends />;
    }
    return <FolloiwngPosts />;
}
