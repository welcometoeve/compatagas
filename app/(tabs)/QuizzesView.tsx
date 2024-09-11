import QuizList from "@/components/quizzes/QuizzesList"
import QuizView from "@/components/quizzes/TakeQuizView"
import { questions, Quiz, quizzes } from "@/constants/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import React, { useState } from "react"

import { SafeAreaView } from "react-native-safe-area-context"
import { Question } from "."

const QuizzesView: React.FC = () => {
  const [curQuizId, setCurQuizId] = useState<number | null>(null)
  const { selfAnswers } = useSelfAnswers()

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
