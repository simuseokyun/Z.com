import style from './page.module.css'
import NodificationList from './_component/NotificationList'

export default async function Page() {
  return (
    <main className={style.main}>
      <div className={style.trend}>
        <h3>알림 목록</h3>
        <NodificationList />
      </div>
    </main>
  )
}
