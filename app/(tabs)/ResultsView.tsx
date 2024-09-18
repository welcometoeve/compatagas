import React from "react"
import { useUser } from "@/contexts/UserContext"
import ResultsList from "@/components/results/resultsList/ResultsLists"
import QuizResultsView from "@/components/results/QuizResultView"
import { questions } from "@/constants/questions"
import { usePage } from "@/contexts/PageContext"

export const ResultsView: React.FC = () => {
  const { user } = useUser()
  const {
    curQuizResultItem,
    setCurQuizResultItem,
    activeResultsTab,
    setActiveResultsTab,
  } = usePage()

  return !curQuizResultItem ? (
    <ResultsList
      setQuizItem={setCurQuizResultItem}
      activeTab={activeResultsTab}
      setActiveTab={setActiveResultsTab}
    />
  ) : (
    <QuizResultsView
      quiz={curQuizResultItem.quiz}
      goBack={() => setCurQuizResultItem(null)}
      questions={questions.filter(
        (q) => q.quizId === curQuizResultItem.quiz.id
      )}
      quizType={user?.id === curQuizResultItem.selfId ? "your" : "their"}
      friendIds={curQuizResultItem.friendIds}
      selfId={curQuizResultItem.selfId}
    />
  )
}
