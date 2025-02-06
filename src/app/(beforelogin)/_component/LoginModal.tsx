'use client'

import style from '@/app/(beforeLogin)/_component/login.module.css'
import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import CloseButton from '@/app/(afterLogin)/_component/CloseButton'

// 회원가입 모달은 useActionState와 서버액션을 활용하여 컴포넌트를 구성했고 로그인 모달은 useState를 활용해 구성햇음
export default function LoginModal() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault() // 브라우저의 기본동작을 막기위해 사용.
    setMessage('')
    try {
      // 회원가입과 로그인을 할땐 Auth.js의 signIn함수 활용할 것
      const result = await signIn('credentials', {
        username: id,
        password,
        redirect: false, // redirect가 false인 경우에는 실패했어도 네트워크엔 성공했다고 뜸 / 그러나 redirect를 true로 만들면 아래 코드가 실행되지 않기때문에 세세한 에러처리를 할 수 없음 / 따라서 auth.ts의 코드를 바꿔줬음 => auth.ts로 이동
      })
      console.log(result)
      if (result?.code === 'no_user') {
        setMessage('가입하지 않은 유저입니다.')
      } else if (result?.code === 'wrong_password') {
        setMessage('비밀번호가 틀렸습니다.')
      } else {
        router.replace('/home')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const onChangeId: ChangeEventHandler<HTMLInputElement> = (e) => {
    setId(e.target.value)
  }

  const onChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value)
  }

  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          <CloseButton />
          <div>로그인하세요.</div>
        </div>
        <form onSubmit={onSubmit}>
          <div className={style.modalBody}>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="id">
                아이디
              </label>
              <input
                id="id"
                className={style.input}
                value={id}
                onChange={onChangeId}
                type="text"
                placeholder=""
              />
            </div>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                className={style.input}
                value={password}
                onChange={onChangePassword}
                type="password"
                placeholder=""
              />
            </div>
          </div>
          <div className={style.message}>{message}</div>
          <div className={style.modalFooter}>
            <button className={style.actionButton} disabled={!id && !password}>
              로그인하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
