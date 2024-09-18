import QuizList from "@/components/quizzes/QuizzesList"
import { questions, Quiz, quizzes } from "@/constants/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import React, { useState } from "react"

import { View } from "react-native"
import QuizView from "@/components/quizzes/takeQuizView/TakeQuizView"

const QuizzesView: React.FC = () => {
  const [curQuizId, setCurQuizId] = useState<number | null>(null)
  const { selfAnswers } = useSelfAnswers()

  const curQuiz = quizzes.find((quiz) => quiz.id === curQuizId)
  const curQuestions = questions.filter(
    (question) => question.quizId === curQuizId
  )
  return (
    <View
      style={{
        backgroundColor: "#111419", // Dark background for the entire list
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
    </View>
  )
}

export default QuizzesView
