'use client'

import useNotificationList from '@/store/notificationList'
import Nodification from './Nodification'

export default function NodificationList() {
  const lists = useNotificationList((state) => state.contentList)
  console.log(lists)
  return (
    <>
      {lists.map((list) => (
        <Nodification key={list.email} content={list.email} />
      ))}
    </>
  )
}
