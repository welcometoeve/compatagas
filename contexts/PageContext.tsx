import React, { createContext, useState, useContext } from "react"

export type Page = "camera" | "album" | "albums" | "profile" | "login"

interface PageContextType {
  page: Page
  setPage: React.Dispatch<React.SetStateAction<Page>>
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [page, setPage] = useState<Page>("camera")

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  )
}

export const usePage = () => {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider")
  }
  return context
}

export default PageContext
