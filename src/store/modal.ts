import { create } from 'zustand'
import { Post } from '@/model/Post'

interface Props {
  mode: '새로운글' | '댓글'
  data: Post | null
  setMode: (mode: '새로운글' | '댓글') => void
  setData: (data: Post) => void
  reset: () => void
  // reset은 보통 객체리터럴로 초기화시키기 때문에 파라미터 필요 X
}
const useModalState = create<Props>((set) => ({
  mode: '새로운글',
  data: null,
  setMode: (mode) => set({ mode }),
  setData: (data) => set({ data }),
  reset: () => set({ mode: '새로운글', data: null }),
}))
export default useModalState
