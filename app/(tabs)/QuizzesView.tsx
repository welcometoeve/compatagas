import QuizList from "@/components/quizzes/QuizzesList"
import { questions, Quiz, quizzes } from "@/components/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import React, { useState } from "react"

import { SafeAreaView } from "react-native-safe-area-context"
import { View } from "react-native"
import QuizView from "@/components/quizzes/takeQuizView/TakeQuizView"
import { usePage } from "@/contexts/PageContext"

const QuizzesView: React.FC = () => {
  const { curTakeQuizId, setTakeCurQuizId } = usePage()

  const curQuiz = quizzes.find((quiz) => quiz.id === curTakeQuizId)
  const curQuestions = questions.filter(
    (question) => question.quizId === curTakeQuizId
  )
  return (
    <View
      style={{
        backgroundColor: "#121212", // Dark background for the entire list
        flex: 1,
      }}
    >
      {curTakeQuizId !== null && curQuiz ? (
        <QuizView
          quiz={curQuiz}
          questions={curQuestions}
          goBack={() => setTakeCurQuizId(null)}
        />
      ) : (
        <QuizList setCurQuizId={setTakeCurQuizId} />
      )}
    </View>
  )
}

export default QuizzesView
