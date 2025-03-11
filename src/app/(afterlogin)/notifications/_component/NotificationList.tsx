'use client'

import useNotificationList from '@/store/notificationList'
import Nodification from './Nodification'

function reverse(list: { postId: string; email: string; createAt: Date }[]) {
  return list.reverse()
}
export default function NodificationList() {
  let lists = useNotificationList((state) => state.contentList)
  if (lists) {
    lists = reverse([...lists])
    // lists를 바로 파라미터로 넣는 건 불변성에 어긋나기 때문에 스프레드 연산자 사용
  }
  return (
    <>
      {lists.map((list) => (
        <Nodification key={list.postId} email={list.email} />
      ))}
    </>
  )
}
