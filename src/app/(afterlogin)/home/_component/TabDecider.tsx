'use client';

import { use } from 'react';
import { TabContext } from '@/app//(afterlogin)/home/_component/TabProvider';
import PostRecommends from './PostRecommends';
import FolloiwngPost from './FollowingPosts';

export default function TabDecider() {
    const { tab } = use(TabContext);
    if (tab === 'rec') {
        return <PostRecommends />;
    }
    return <FolloiwngPost />;
}
