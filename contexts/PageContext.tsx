import React, { createContext, useState, useContext, ReactNode } from "react"
import { QuizItem } from "@/components/results/proccessQuizLists"

export type Page = "quizzes" | "questions" | "results" | "profile"

interface PageContextType {
  page: Page
  setPage: (page: Page) => void
  curquizId: number | null
  setCurquizId: (id: number | null) => void
  activeResultsTab: "your" | "their"
  setActiveResultsTab: (tab: "your" | "their") => void
  curQuizResultItem: QuizItem | null
  setCurQuizResultItem: (item: QuizItem | null) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [page, setCurrentPage] = useState<Page>("questions")
  const [curquizId, setCurquizId] = useState<number | null>(null)
  const [activeResultsTab, setActiveResultsTab] = useState<"your" | "their">(
    "your"
  )
  const [curQuizResultItem, setCurQuizResultItem] = useState<QuizItem | null>(
    null
  )

  const setPage = (page: Page) => {
    setCurrentPage(page)
  }

  return (
    <PageContext.Provider
      value={{
        page,
        setPage,
        curquizId,
        setCurquizId,
        activeResultsTab,
        setActiveResultsTab,
        curQuizResultItem,
        setCurQuizResultItem,
      }}
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
