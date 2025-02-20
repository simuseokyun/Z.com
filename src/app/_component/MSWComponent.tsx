'use client'

import { Suspense, use } from 'react'
import handlers from '@/mocks/handlers'

const mockingEnabledPromise =
  typeof window !== 'undefined'
    ? import('@/mocks/browser').then(async ({ default: worker }) => {
        if (
          process.env.NODE_ENV === 'production' ||
          process.env.NEXT_PUBLIC_MSW_ENABLED === 'false'
        ) {
          return
        }
        await worker.start({
          onUnhandledRequest(request, print) {
            if (request.url.includes('_next')) {
              return
            }
            print.warning()
          },
        })
        worker.use(...handlers)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(module as any).hot?.dispose(() => {
          worker.stop()
        })
        console.log(worker.listHandlers())
      })
    : Promise.resolve()

function MSWProviderWrapper({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  use(mockingEnabledPromise)
  return children
}

export default function MSWProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={null}>
      <MSWProviderWrapper>{children}</MSWProviderWrapper>
    </Suspense>
  )
}
