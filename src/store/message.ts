import { create } from 'zustand'

interface MessageState {
  shouldGoDown: boolean
  setGoDown: (value: boolean) => void
  reset: () => void
}
const useMessageStore = create<MessageState>((set) => ({
  shouldGoDown: false,
  setGoDown: (value: boolean) => {
    set({ shouldGoDown: value })
  },
  reset: () => {
    set({ shouldGoDown: false })
  },
}))

export default useMessageStore
