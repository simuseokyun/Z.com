'use client'

import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
// 클라이언트에선 next-auth / 서버 컴포넌트에선 next-auth 로 import할 것
import CloseButton from '@/app/(afterLogin)/_component/CloseButton'
import style from './signup.module.css'

function showMessage(message: string | null | undefined) {
  if (message === 'user_exists') {
    return '이미 사용 중인 아이디입니다.'
  }
  return message
}

export default function SignupModal() {
  const router = useRouter()

  const [id, setId] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const changeId: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    setId(e.target.value)
  }
  const changeNick: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    setNickname(e.target.value)
  }
  const changePass: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    setPassword(e.target.value)
  }
  const changeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    if (e.target.files) {
      setImage(e.target.files[0].name)
    }
  }

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    // FormData에서 입력된 값 출력
    // 예시로 'name'이라는 name 속성을 가진 input의 값을 출력
    formData.set('nickname', formData.get('name') as string) // nickname이란 속성과 값 formDatad에 추가
    let shouldRedirect = false
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
      {
        method: 'post',
        body: formData,
      },
    )

    if (response.status === 403) {
      setMessage('user_exists')
      return
    }
    if (response.status === 400) {
      // eslint-disable-next-line consistent-return
      return {
        message: (await response.json()).data[0],
        id: formData.get('id'),
        nickname: formData.get('nickname'),
        password: formData.get('password'),
        image: formData.get('image'),
      }
    }
    shouldRedirect = true
    await signIn('credentials', {
      username: id,
      password,
      redirect: false,
    })

    if (shouldRedirect) {
      router.replace('/home')
    }
  }

  return (
    <div className={style.modalBackground}>
      <div className={style.modal}>
        <div className={style.modalHeader}>
          <CloseButton />
          <div>계정을 생성하세요.</div>
        </div>
        <form onSubmit={onSubmit}>
          {/* // form태그에서 action과 onSubmit은 비슷해 보이지만 엄연히 다르다. action은 데이터를 서버로 전송하는 경로이고 폼 제출 시, 해당 URL로 요청을 보낸다. 또한 새로고침이 발생한다.
          onSubmit은 폼 제출 시 자바스크립트 함수를 실행하는 것으로 제출 전에 JS코드를 실행한다 (검증 및 비동기 작업) 페이지의 이동이 발생하지 않는다. */}
          <div className={style.modalBody}>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="id">
                {/* html은 for을 사용하지만 react에선 htmlFor 사용 */}
                아이디
              </label>
              <input
                id="id"
                name="id" // input의 name값은 formData의 key값으로 들어감
                className={style.input}
                type="text"
                onChange={changeId}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="name">
                닉네임
              </label>
              <input
                id="name"
                name="name"
                className={style.input}
                type="text"
                onChange={changeNick}
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                onChange={changePass}
                className={style.input}
                type="password"
                placeholder="비밀번호를 입력해주세요"
                required
              />
            </div>
            <div className={style.inputDiv}>
              <label className={style.inputLabel} htmlFor="image">
                프로필
              </label>
              <input
                id="image"
                name="image"
                required
                onChange={changeImage}
                className={style.input}
                type="file"
                accept="image/*"
              />
            </div>
          </div>
          <p style={{ textAlign: 'center', color: 'red' }}>
            {showMessage(message)}
          </p>
          <div className={style.modalFooter}>
            <button
              type="submit"
              className={style.actionButton}
              disabled={!id || !password || !nickname || !image}
            >
              가입하기
            </button>
            <div className={style.error} />
          </div>
        </form>
      </div>
    </div>
  )
}
