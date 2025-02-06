import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // req는 http요청을 의미 (header,cookies 등이 들어있다)

  const token = req.cookies.get('authjs.session-token') // 이걸로도 되나 테스트
  if (!token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/i/flow/login`,
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/compose/tweet', '/home', '/explore', '/messages', '/search'],
}
