import style from './profile.module.css';
import Post from '../_component/Post';
import BackButton from '../_component/BackButton';
import UserInfo from './_component/UserInfo';
export default function Profile() {
    const user = {
        id: 'zerohch0',
        nickname: '제로초',
        image: '/5Udwvqim.jpg',
    };

    return (
        <main className={style.main}>
            <div className={style.header}>
                <BackButton />
                <h3 className={style.headerTitle}>{user.nickname}</h3>
            </div>
            <UserInfo user={user} />
            <div>
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
                <Post />
            </div>
        </main>
    );
}
