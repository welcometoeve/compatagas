import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native"
import { ChevronLeft } from "lucide-react-native"
import { Question, Quiz, Side } from "@/components/questions"
import { useUser } from "@/contexts/UserContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import ResultSlider from "../quizzes/takeQuizView/ResultSlider"
import QuestionView from "../quizzes/takeQuizView/QuestionView"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"

type QuizResultsViewProps = {
  quiz: Quiz
  questions: Question[]
  goBack: () => void
  resultType: "your" | "their"
  theirIds: number[]
}

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  quiz,
  questions,
  goBack,
}) => {
  const [answers, setAnswers] = useState<{
    [key: number]: { label: string; side: Side }
  }>({})
  const [quizResult, setQuizResult] = useState<number | null>(null)

  const { user } = useUser()
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()

  useEffect(() => {
    if (user && selfAnswers) {
      const userAnswers = selfAnswers.filter(
        (sa) => sa.userId === user.id && sa.quizId === quiz.id
      )

      const answersMap: { [key: number]: { label: string; side: Side } } = {}
      userAnswers.forEach((sa) => {
        const question = questions.find((q) => q.id === sa.questionId)
        if (question) {
          const option = question.options[sa.optionIndex]
          answersMap[sa.questionId] = { label: option.label, side: option.side }
        }
      })

      setAnswers(answersMap)
      calculateQuizResult(answersMap)
    }
  }, [user, selfAnswers, questions, quiz.id])

  const calculateQuizResult = (finalAnswers: {
    [key: number]: { label: string; side: Side }
  }) => {
    let totalScore = 0
    questions.forEach((question) => {
      const answer = finalAnswers[question.id]
      if (answer) {
        const optionIndex = question.options.findIndex(
          (opt) => opt.label === answer.label && opt.side === answer.side
        )
        const score = answer.side === Side.LEFT ? -1 : 1
        const normalizedScore =
          score *
          ((optionIndex % (question.options.length / 2)) /
            (question.options.length / 2 - 1))
        totalScore += normalizedScore
      }
    })
    const averageScore = totalScore / questions.length
    setQuizResult(averageScore)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 0 }}
      >
        <TouchableOpacity
          onPress={goBack}
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 1,
          }}
        >
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <View style={{ marginBottom: 24, alignItems: "center" }}>
          <Image
            source={quiz.src}
            style={{
              width: 200,
              height: 200,
              borderRadius: 16,
              marginBottom: 16,
            }}
            resizeMode="cover"
          />
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
            }}
          >
            {`Your ${quiz.name}`} Results
          </Text>
        </View>

        {quizResult !== null && (
          <ResultSlider quiz={quiz} quizResult={quizResult} />
        )}

        <View
          style={{
            height: 50,
          }}
        ></View>

        {questions.map((question) => (
          <QuestionView
            key={question.id}
            question={question}
            answers={answers}
            lockedAnswers={new Set(questions.map((q) => q.id))}
            handleOptionSelect={() => {}}
            index={question.id}
          />
        ))}

        <TouchableOpacity
          onPress={goBack}
          style={{
            marginTop: 24,
            marginBottom: 24,
            backgroundColor: "rgb(40, 40, 40)",
            padding: 12,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Back to Quizzes
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default QuizResultsView
