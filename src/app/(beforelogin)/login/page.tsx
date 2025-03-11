import { redirect } from 'next/navigation'
import Main from '../_component/Main'
import { auth } from '@/auth'
import MoveLogin from '../_component/MoveLogin'

export default async function Page() {
  const session = await auth()
  if (session?.user) {
    redirect('/home')
  }

  return (
    <>
      <Main />
      <MoveLogin />
    </>
  )
}
