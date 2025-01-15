import LoginModal from '@/app/(beforelogin)/_component/LoginModal';
export default function Page() {
    return <LoginModal />;
}

// 여긴 해당 Link태그를 통해 로그인에 접속하지 않을 경우 보여짐 => 새로고침이나 직접 URL을 작성하는 경우
// 인터셉팅 라우터는 Link태그를 통해서만 작동되기 때문
