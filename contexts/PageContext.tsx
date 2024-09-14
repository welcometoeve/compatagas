import React, { createContext, useState, useContext, ReactNode } from "react"

export type PageType = "quizzes" | "questions" | "results"

interface PageContextType {
  page: PageType
  setPage: React.Dispatch<React.SetStateAction<PageType>>
  curTakeQuizId: number | null
  setTakeCurQuizId: React.Dispatch<React.SetStateAction<number | null>>
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [page, setPage] = useState<PageType>("questions")
  const [curTakeQuizId, setTakeCurQuizId] = useState<number | null>(null)

  return (
    <PageContext.Provider
      value={{ page, setPage, curTakeQuizId, setTakeCurQuizId }}
    >
      {children}
    </PageContext.Provider>
  )
}

export const usePage = (): PageContextType => {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider")
  }
  return context
}
