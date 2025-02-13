export { GET, POST } from '@/auth'

// [...nextauth]는 catch-all-route로 이 routeModule.ts파일은 app/api/ 다음 경로에 오는 모든 파일에 대해 이 route.ts를 실행시킨다.

// route.ts는 주로 API 라우팅을 관리하거나 라우팅 관련 설정을 담당하는 파일입니다. 특히 Next.js와 같은 프레임워크에서는 라우트를 처리하고 서버 사이드 로직을 설정하는 데 사용됩니다

// route.ts는 서버 로직을 담당하고, 클라이언트는 이 API를 호출하여 데이터를 주고받습니다. 이는 서버 사이드와 클라이언트 사이드 로직을 분리하는 좋은 방법입니다.
