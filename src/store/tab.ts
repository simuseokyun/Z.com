import { create } from 'zustand'

interface TabState {
  mode: 'rec' | 'fol'
  setFol: () => void
  setRec: () => void
}
const useTabState = create<TabState>((set) => ({
  mode: 'rec',
  setFol: () => {
    set({ mode: 'fol' })
  },
  setRec: () => {
    set({ mode: 'rec' })
  },
}))

export default useTabState
