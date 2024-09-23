import React, { createContext, useState, useContext, ReactNode } from "react"
import { QuizItem } from "@/components/results/proccessQuizLists"

interface PageContextType {
  pushPage: (page: PageStackItem) => void
  popPage: () => void
  resetStack: (page: PageStackItem) => void
  pageStack: PageStackItem[]
}

export type PageEnum =
  | "newPacks"
  | "feed"
  | "profile"
  | "takeQuiz"
  | "quizResult"

const PageContext = createContext<PageContextType | undefined>(undefined)

export type PageStackItem =
  | {
      type: "newPacks" | "feed"
    }
  | {
      type: "profile"
      userId: number
    }
  | {
      type: "takeQuiz"
      quizId: number
      userId: number
    }
  | {
      type: "quizResult"
      quizId: number
      userId: number
      friendIds: number[]
    }

export const PageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pageStack, setPageStack] = useState<PageStackItem[]>([
    { type: "feed" },
  ])

  const pushPage = (page: PageStackItem) => {
    setPageStack([...pageStack, page])
  }

  const popPage = () => {
    setPageStack(pageStack.slice(0, pageStack.length - 1))
  }

  const resetStack = (page: PageStackItem) => {
    setPageStack([page])
  }

  return (
    <PageContext.Provider
      value={{
        pushPage,
        popPage,
        resetStack,
        pageStack,
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
