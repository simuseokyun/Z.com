'use server';

import { redirect } from 'next/navigation';
import { signIn } from '@/auth';

export default async (prevState: { message: string | null }, formData: FormData) => {
    // 해당 서버액션을 사용하는 컴포넌트에서 useActionState를 사용한다면 해당 서버액션 첫 번째 매개변수에 prevState를 작성해줘야 함. prevState에는 초기 값의 타입을 지정
    if (!formData.get('id') || !(formData.get('id') as string)?.trim()) {
        // trim()은 공백 제거해주는 함수 (문자열에만 사용가능)
        return { message: 'no_id' };
    }
    if (!formData.get('name') || !(formData.get('name') as string)?.trim()) {
        return { message: 'no_name' };
    }
    if (!formData.get('password') || !(formData.get('password') as string)?.trim()) {
        return { message: 'no_password' };
    }
    if (!formData.get('image')) {
        return { message: 'no_image' };
    }
    formData.set('nickname', formData.get('name') as string); // nickname이란 속성과 값 formDatad에 추가
    let shouldRedirect = false;
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
            method: 'post',
            body: formData,
            credentials: 'include',
        });
        console.log(response.status);
        console.log(response.json());
        if (response.status === 403) {
            return { message: 'user_exists' };
        } else if (response.status === 400) {
            return {
                message: (await response.json()).data[0],
                // data[0]은 에러 메시지 배열 중 첫 번째 메시지(주로 가장 중요한 문제)를 나타냅니다.
                id: formData.get('id'),
                nickname: formData.get('nickname'),
                password: formData.get('password'),
                image: formData.get('image'),

                // 400 에러 발생 시 클라이언트에서 해당 데이터를 다시 사용할 가능성이 있기 때문에 사용자가 입력했던 데이터 그대로 반환
            };
        }

        shouldRedirect = true;
        await signIn('credentials', {
            username: formData.get('id'),
            password: formData.get('password'),
            redirect: false,
        });
    } catch (err) {
        console.error(err);
        return { message: null };
    }

    if (shouldRedirect) {
        redirect('/home'); // try/catch문 안에서 X
    }
    return { message: null };
};
