import { create } from 'zustand'

interface Props {
  contentList: { postId: string; email: string; createAt: Date }[]
  clickState: boolean
  setClickState: (value: boolean) => void
  addContent: (list: { postId: string; email: string; createAt: Date }) => void
}

const useNotificationList = create<Props>((set) => ({
  contentList: [
    { postId: '1', email: 'test', createAt: new Date() },
    { postId: '2', email: 'test2', createAt: new Date() },
  ],

  clickState: false,
  setClickState: (value) => {
    set({ clickState: value })
  },
  addContent: (newContent) =>
    set((state) => {
      // 기존 contentList를 출력하고, 추가한 후 길이 체크
      const updatedList = [...state.contentList, newContent]

      // 길이가 10을 초과하면 첫 번째 요소 제거
      if (updatedList.length > 10) {
        updatedList.shift()
      }

      // 상태 업데이트
      return { contentList: updatedList }
    }),
}))

export default useNotificationList
