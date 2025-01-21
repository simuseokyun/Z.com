'use client';
import Trend from '@/app/(afterLogin)/_component/Trend';
import { useQuery } from '@tanstack/react-query';
import { Hashtag } from '@/model/Hashtag';
import { getTrends } from '@/app/(afterLogin)/_lib/getTrends';

export default function TrendSection() {
    const { data } = useQuery<Hashtag[]>({
        queryKey: ['hashtags', 'trends'],
        queryFn: getTrends,
        staleTime: 60 * 1000, // staleTime 동안 데이터를 fresh 상태로 유지
        gcTime: 300 * 1000, // 캐시가 300초 동안 유지된 후 삭제
    });

    return data?.map((trend) => <Trend trend={trend} key={trend.title} />);
}
