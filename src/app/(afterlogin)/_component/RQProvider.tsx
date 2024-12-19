'use client';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
type Props = {
    children: React.ReactNode;
};
export default function RQProvider({ children }: Props) {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false, // 화면 클릭햇을 때 다시 가져오는거(탭전환)
                    retry: false, // fetch 실패햇을경우 몇 번 더 요청할지 (재시도)
                    retryOnMount: true, // 컴포넌트가 언마운트 됏다가 마운트됐을 때 다시 가져오는 것
                    refetchOnReconnect: false, // 인터넷 연결끊겻다가 다시 접속되는 순간 다시 가져오는 것
                },
            },
        })
    );
    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV === 'development'} />
        </QueryClientProvider>
    );
}
