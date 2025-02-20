'use client'

import { SessionProvider } from 'next-auth/react'

type Props = {
  children: React.ReactNode
}

export default function AuthSession({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}

// SessionProvider는 클라이언트 사이드에서만 동작하는 인증 관련 상태를 관리하기 때문에, 해당 컴포넌트가 서버에서 실행되지 않도록 보장해야 합니다.
