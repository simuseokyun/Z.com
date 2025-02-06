async function getTrends() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/hashtags/trends`,
    {
      next: {
        tags: ['trends'],
        // Next.js의 fetch 확장 기능 중 하나로, 특정 요청에 태그(tags)를 추가하여 데이터 캐싱 및 재검증(revalidation)을 효율적으로 관리할 수 있도록 도와주는 설정입니다.
        // 해당 데이터에 trends 라는 태그를 추가해주는 것
      },

      credentials: 'include', // 사용자의 인증 정보를 포함하여 요청을 전송하도록 설정합니다 (쿠키)
      cache: 'no-store', // 사실 next15 부터는 no-store 가 기본값이 되어서 명시 안해줘도 됨

      // headers: {
      //     Cookie: (await cookies()).toString(),
      //     Cookie 넣어야 되는 경우는 쿠키가 없는 상태에서 서버 인증이 필요한 경우, 서버 함수에서 보내줘야 함
      // },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}
export default getTrends
