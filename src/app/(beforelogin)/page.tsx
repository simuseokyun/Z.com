import { redirect } from 'next/navigation'
import { auth } from '@/auth'

import Main from './_component/Main'

export default async function Page() {
  const data = await auth()

  if (data?.user) {
    redirect('/home')
  }
  return <Main />
}
