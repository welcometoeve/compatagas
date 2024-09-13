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
import processQuizLists from "@/components/proccessQuizLists"
import ResultsList, { QuizItem } from "@/components/results/ResultsLists"
import QuizResultsView from "@/components/results/QuizResultView"

export const ResultsView: React.FC = () => {
  const [curQuizItem, setCurQuizItem] = useState<QuizItem | null>(null)

  return !curQuizItem ? (
    <ResultsList setQuizItem={setCurQuizItem} />
  ) : (
    <QuizResultsView
      quiz={curQuizItem.quiz}
      goBack={() => setCurQuizItem(null)}
      questions={questions.filter((q) => q.quizId === curQuizItem.quiz.id)}
      resultType="your"
      theirIds={curQuizItem.theirIds}
    />
  )
}
