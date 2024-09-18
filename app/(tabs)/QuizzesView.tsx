import QuizList from "@/components/quizzes/QuizzesList"
import { questions, Quiz, quizzes } from "@/constants/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import React from "react"
import { View } from "react-native"
import QuizView from "@/components/quizzes/takeQuizView/TakeQuizView"
import { usePage } from "@/contexts/PageContext" // Import the usePage hook

const QuizzesView: React.FC = () => {
  const { selfAnswers } = useSelfAnswers()
  const { curquizId, setCurquizId } = usePage() // Use the context

  const curQuiz = quizzes.find((quiz) => quiz.id === curquizId)
  const curQuestions = questions.filter(
    (question) => question.quizId === curquizId
  )

  return (
    <View
      style={{
        backgroundColor: "#111419",
        flex: 1,
      }}
    >
      {curquizId !== null && curQuiz ? (
        <QuizView
          quiz={curQuiz}
          questions={curQuestions}
          goBack={() => setCurquizId(null)}
        />
      ) : (
        <QuizList setCurQuizId={setCurquizId} />
      )}
    </View>
  )
}

export default QuizzesView
