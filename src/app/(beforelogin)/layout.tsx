import styles from '@/app/(beforeLogin)/_component/main.module.css'

type Props = {
  children: React.ReactNode
  modal: React.ReactNode
}

export default function Layout({ children, modal }: Props) {
  return (
    <div className={styles.container}>
      {children}
      {/* 로그인을 누를 경우 login의 page가 children영역에 들어감 */}
      {modal}
      {/* 로그인을 누를 경우 @modal/i/flow/login의 page가 modal영역에 들어감 */}
    </div>
  )
}
