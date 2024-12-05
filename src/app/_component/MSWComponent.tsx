'use client';
import { useEffect, ReactNode } from 'react';

export const MSWComponent = () => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
                require('@/mocks/browser');
            }
        }
    }, []);

    return null;
};
