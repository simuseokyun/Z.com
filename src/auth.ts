import NextAuth, { CredentialsSignin } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    unstable_update,
    signOut,
} = NextAuth({
    pages: {
        signIn: '/i/flow/login',
        newUser: '/i/flow/signup',
    },
    // callbacks: {
    //     async authorized({ request, auth }) {
    //         if (!auth) {
    //             return NextResponse.redirect('http://localhost:3000/i/flow/login');
    //         }
    //         return true;
    //     },
    // }, 이 부분은 middleware.ts에서 따로 처리해주기 때문에 지웟음
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: credentials.username, // username과 password는 회원가입 서버액션에서 설정한 키값과 일치해야함 => signup.ts
                        password: credentials.password,
                    }),
                });
                // 네트워크 요청을 통해 로그인 오류( 비밀번호 틀림 / 사용자 없음 )를 받았을 때 아래 코드를 통해 에러 메시지를 내보내 줄 수 있음
                if (!authResponse.ok) {
                    const credentialsSignin = new CredentialsSignin();
                    if (authResponse.status === 404) {
                        credentialsSignin.code = 'no_user';
                    } else if (authResponse.status === 401) {
                        credentialsSignin.code = 'wrong_password';
                    }
                    throw credentialsSignin;
                }

                const user = await authResponse.json();
                console.log('user', user);
                return {
                    email: user.id,
                    name: user.nickname,
                    image: user.image,
                    ...user,
                    // auth에선 email,name,image 세 가지 값만 내보낼 수 있어서 해당 값으로 처리해줘야 함
                };
            },
        }),
    ],
});
