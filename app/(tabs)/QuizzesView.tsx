import QuizList from "@/components/quizzes/QuizzesList"
import QuizView from "@/components/quizzes/QuizView"
import { questions, Quiz, quizzes } from "@/constants/questions"
import React, { useState } from "react"
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItem,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const QuizzesView: React.FC = () => {
  const [curQuizId, setCurQuizId] = useState<number | null>(null)

  const curQuiz = quizzes.find((quiz) => quiz.id === curQuizId)
  const curQuestions = questions.filter(
    (question) => question.quizId === curQuizId
  )
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#121212", // Dark background for the entire list
        flex: 1,
      }}
    >
      {curQuizId !== null && curQuiz ? (
        <QuizView
          quiz={curQuiz}
          questions={curQuestions}
          goBack={() => setCurQuizId(null)}
        />
      ) : (
        <QuizList setCurQuizId={setCurQuizId} />
      )}
    </SafeAreaView>
  )
}

export default QuizzesView
