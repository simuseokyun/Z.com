'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import Main from '../_component/Main'

export default function Page() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/i/flow/login')
  }, [])

  return <Main />
}
