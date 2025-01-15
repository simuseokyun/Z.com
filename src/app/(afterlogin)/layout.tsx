import { ReactNode } from 'react';
import style from '@/app/(afterLogin)/layout.module.css';
import Link from 'next/link';
import Image from 'next/image';
import ZLogo from '../../../public/5Udwvqim.jpg';
import NavMenu from './_component/NavMenu';
import TrendSection from './_component/TrendSection';
import LogoutButton from './_component/LogoutButton';
import FollowRecommend from './_component/FollowRecommend';
import RightSearchZone from './_component/RightSearchZone';
import { auth } from '@/auth';
import RQProvider from './_component/RQProvider';
import FollowRecommendSection from './_component/FollowRecommendSection';

type Props = { children: ReactNode; modal: ReactNode };
export default async function AfterLoginLayout({ children, modal }: Props) {
    const session = await auth();
    console.log(session);
    if (!session || !session.user) {
        return <div>로그인이 필요합니다.</div>; // 세션이 없거나 user가 없을 때 처리
    }

    return (
        <div className={style.container}>
            <header className={style.leftSectionWrapper}>
                <section className={style.leftSection}>
                    <div className={style.leftSectionFixed}>
                        <Link className={style.logo} href="/home">
                            <div className={style.logoPill}>
                                <Image src={ZLogo} alt="z.com로고" width={40} height={40} />
                            </div>
                        </Link>

                        <nav>
                            <ul>
                                <NavMenu />
                            </ul>
                            <Link href="/compose/tweet" className={style.postButton}>
                                <span>게시하기</span>
                            </Link>
                            <LogoutButton me={session} />
                            {/* LogoutButton에서 그냥 useSession()을 사용해서 정보를 받아오면 될 줄 알았는데 그렇게 하면 로그아웃 버튼이 나타나질 않음 => 그래서 prop으로 전달해줫음 */}
                        </nav>
                    </div>
                </section>
            </header>
            <RQProvider>
                <div className={style.rightSectionWrapper}>
                    <div className={style.rightSectionInner}>
                        <main className={style.main}>{children}</main>
                        <section className={style.rightSection}>
                            <RightSearchZone />
                            <TrendSection session={session} />
                            <div className={style.followRecommend}>
                                <h3>팔로우 추천</h3>
                                <FollowRecommendSection />
                            </div>
                        </section>
                    </div>
                </div>
                {modal}
            </RQProvider>
        </div>
    );
}
