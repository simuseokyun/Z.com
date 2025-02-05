"use client";
import React, { ReactNode } from "react";
import { useState, createContext } from "react";

type Props = { children: ReactNode };

export const TabContext = createContext({
  tab: "recommend",
  setTab: (value: "recommend" | "follow") => {},
});
export default function TabProvider({ children }: Props) {
  const [tab, setTab] = useState("recommend");
  return (
    <TabContext.Provider value={{ tab, setTab }}>
      {children}
    </TabContext.Provider>
  );
}
