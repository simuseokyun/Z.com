'use client'

/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactNode, useState, createContext } from 'react'

type Props = { children: ReactNode }

export const TabContext = createContext({
  tab: 'recommend',

  setTab: (value: 'recommend' | 'follow') => {},
})

export default function TabProvider({ children }: Props) {
  const [tab, setTab] = useState('recommend')
  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  )
}
