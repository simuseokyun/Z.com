'use client'

import useSocket from '../_lib/useSocket'

export default function WebSocketComponent() {
  // 이 컴포넌트의 용도는 단순 연결을 맺는 용도
  useSocket()
  return null
}
