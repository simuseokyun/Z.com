import { auth } from './auth';
import { NextResponse } from 'next/server';

export async function middleware() {
    const session = await auth();
    if (!session) {
        return NextResponse.redirect('http://localhost:3000/i/flow/login');
    }
}

export const config = {
    matcher: ['/compose/tweet', '/home', '/explore', '/messages', '/search'],
};

// next 공식문서에 middleware 쪽 볼 것

// 미들웨어는 서버에서 실행되며, 클라이언트와 서버 사이에서 요청을 가로채는 기능을 합니다. 즉, 미들웨어는 요청이 클라이언트에서 서버로 전달되기 전에 먼저 실행되어, 그 과정에서 인증이 필요한지 확인하고 리다이렉트 등의 처리를 할 수 있습니다
