'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
  const onError = () => reset()

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button type="button" onClick={onError}>
        Try again
      </button>
    </div>
  )
}
