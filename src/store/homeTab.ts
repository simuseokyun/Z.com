import { create } from 'zustand'

interface TabProps {
  mode: 'recommend' | 'follow'
  setFol: () => void
  setRec: () => void
}
const useTabState = create<TabProps>((set) => ({
  mode: 'recommend',
  setFol: () => {
    set({ mode: 'follow' })
  },
  setRec: () => {
    set({ mode: 'recommend' })
  },
}))

export default useTabState
