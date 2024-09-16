import { Quiz, quizzes, Question, questions } from "@/components/questions"
import React, { useState, useMemo } from "react"
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronRight } from "lucide-react-native"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"
import collect from "@/components/collect"
import { act } from "react-test-renderer"
import ResultsList from "@/components/results/resultsList/ResultsLists"
import QuizResultsView from "@/components/results/QuizResultView"
import { QuizItem } from "@/components/results/proccessQuizLists"

export const ResultsView: React.FC = () => {
  const [curQuizItem, setCurQuizItem] = useState<QuizItem | null>(null)
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState<"your" | "their">("your")

  return !curQuizItem ? (
    <ResultsList
      setQuizItem={setCurQuizItem}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  ) : (
    <QuizResultsView
      quiz={curQuizItem.quiz}
      goBack={() => setCurQuizItem(null)}
      questions={questions.filter((q) => q.quizId === curQuizItem.quiz.id)}
      quizType={user?.id === curQuizItem.selfId ? "your" : "their"}
      friendIds={curQuizItem.friendIds}
      selfId={curQuizItem.selfId}
    />
  )
}
