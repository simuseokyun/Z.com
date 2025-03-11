import { create } from 'zustand'

interface MessageState {
  shouldGoDown: boolean
  setGoDown: (value: boolean) => void
}
const useMessageStore = create<MessageState>((set) => ({
  shouldGoDown: false,
  setGoDown: (value) => {
    set({ shouldGoDown: value })
  },
}))

export default useMessageStore
