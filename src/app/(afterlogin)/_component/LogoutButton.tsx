'use client';
import style from './logoutButton.module.css';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

type Props = {
    me: Session | null;
};
export default function LogoutButton({ me }: Props) {
    const router = useRouter();
    // 이게 서버사이드렌더링과도 연관이 있는데요. 서버사이드 렌더링 시에 useSession에는 값이 없고 auth에만 값이 있습니다. 원래부터 auth가 서버 용도라서요. 그래서 LogoutButton도 서버사이드렌더링 되는 상황이라 auth를 props로 넘겨 값을 주었습니다 (useSession()에 관한 제로초답변 ) 즉 layout.tsx가 서버사이드랜더링이기 때문에 LogoutButton도 서버사이드 되는 상황이라 useSession()이 작동하지 않게 됨

    const onLogout = () => {
        signOut({ redirect: false }).then(() => {
            router.replace('/');
        });
    };
 // 경고창
    if (!me?.user) {
        return null;
    }

    return (
        <button className={style.logOutButton} onClick={onLogout}>
            <div className={style.logOutUserImage}>
                <img src={me.user?.image as string} alt={me.user?.email as string} />
            </div>
            <div className={style.logOutUserName}>
                <div>{me.user?.name}</div>
                <div>@{me.user?.email}</div>
            </div>
        </button>
    );
}
