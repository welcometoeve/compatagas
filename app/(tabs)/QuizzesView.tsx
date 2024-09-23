import QuizList from "@/components/quizzes/QuizzesList"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import React from "react"
import { View } from "react-native"
import QuizView from "@/components/quizzes/takeQuizView/TakeQuizView"
import { usePage } from "@/contexts/PageContext" // Import the usePage hook
import { questions, quizzes } from "@/constants/questions/questions"

const QuizzesView: React.FC = () => {
  return (
    <View
      style={{
        backgroundColor: "#111419",
        flex: 1,
      }}
    >
      <QuizList />
    </View>
  )
}

export default QuizzesView
