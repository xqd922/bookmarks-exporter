import type { TreeDataNode } from "@/types/bookmarks"
import type { ReactNode } from "react"
import React, { createContext, useState } from "react"

interface IconData {
  fileName: string
  blob: Blob
}

interface AppContextProps {
  treeData: TreeDataNode[]
  setTreeData: React.Dispatch<React.SetStateAction<any[]>>
  iconData: Map<string, IconData>
  setIconData: React.Dispatch<React.SetStateAction<Map<string, IconData>>>
}

export const AppContext = createContext<AppContextProps | undefined>(undefined)

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [treeData, setTreeData] = useState([])
  const [iconData, setIconData] = useState(new Map<string, IconData>())

  return (
    <AppContext.Provider value={{ treeData, setTreeData, iconData, setIconData }}>
      {children}
    </AppContext.Provider>
  )
}
