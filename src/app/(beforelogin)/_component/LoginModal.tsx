'use client';

import style from '@/app/(beforeLogin)/_component/login.module.css';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import CloseButton from '@/app/(afterlogin)/_component/CloseButton';

export default function LoginModal() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const result = await signIn('credentials', {
                username: id,
                password,
                redirect: false, // redirect가 false인 경우에는 실패했어도 네트워크엔 성공했다고 뜸 / 그러나 redirect를 true로 만들면 아래 코드가 실행되지 않기때문에 세세한 에러처리를 할 수 없음 / 따라서 auth.ts의 코드를 바꿔줬음 => auth.ts로 이동
            });
            console.log(result);
            if (result?.code === 'no_user') {
                setMessage('가입하지 않은 유저입니다.');
            } else if (result?.code === 'wrong_password') {
                setMessage('비밀번호가 틀렸습니다.');
            }
            router.replace('/home');
        } catch (err) {
            console.error(err);
        }
    };
    const onClickClose = () => {
        router.back();
    };

    const onChangeId: ChangeEventHandler<HTMLInputElement> = (e) => {
        setId(e.target.value);
    };

    const onChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.target.value);
    };

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
    );
}
