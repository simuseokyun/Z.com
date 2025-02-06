import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers.
const worker = setupWorker(...handlers)

export default worker

// 브라우저.ts 에선 export default로 내보내기
