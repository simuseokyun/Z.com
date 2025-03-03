'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function MoveLogin() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/i/flow/login')
  }, [])
  return null
}
