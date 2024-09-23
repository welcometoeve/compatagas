import React, { useState, useEffect, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
} from "react-native"
import { ChevronLeft, ChevronRight } from "lucide-react-native"
import { Question, Quiz, Side } from "@/constants/questions/types"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { CustomAlert } from "./CustomAlert"
import QuestionView, { Answers } from "./QuestionView"
import ResultSlider from "./QuizResultsWithoutFriendsView"
import { addSelfAnswerInitiatedNotification } from "@/contexts/notification/addNotification"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useNotification } from "@/contexts/notification/NotificationContext"
import * as Haptics from "expo-haptics"
import collect from "@/components/collect"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFriends } from "@/contexts/FriendsContext"
import { questions, quizzes } from "@/constants/questions/questions"
import { usePage } from "@/contexts/PageContext"

export type SelfAnswer = {
  id: number
  userId: number
  questionId: number
  optionIndex: number
  quizId: number
}

type QuizViewProps = {
  quizId: number
  userId: number
}

const TakeQuizView: React.FC<QuizViewProps> = ({ quizId, userId }) => {
  const [answers, setAnswers] = useState<Answers>({})
  const [lockedAnswers, setLockedAnswers] = useState<Set<number>>(new Set())
  const [showWarning, setShowWarning] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSucces, setSubmitSuccess] = useState(false)
  const { popPage } = usePage()
  const { addSelfAnswer, selfAnswers } = useSelfAnswers()
  const { user } = useUser()
  const { friends: friends } = useFriends()

  const quiz = quizzes.find((quiz) => quiz.id === quizId)
  const quizQuestions: Question[] = questions.filter(
    (question) => question.quizId === quizId
  )
  const quizResult = useMemo(() => {
    const calculateQuizResult = (selfAnswers: SelfAnswer[]) => {
      let totalScore = 0
      quizQuestions.forEach((question) => {
        const selfAnswer = selfAnswers.find(
          (sa) => sa.questionId === question.id
        )
        if (selfAnswer) {
          const optionIndex = selfAnswer.optionIndex
          const side = question.options[optionIndex].side
          const score = side === "neither" ? 0 : side === "left" ? -1 : 1

          totalScore += score
        }
      })
      const averageScore = totalScore / quizQuestions.length
      return averageScore
    }

    const relevantAnswers = selfAnswers.filter(
      (sa) => sa.quizId === quiz?.id && sa.userId === user?.id
    )

    return relevantAnswers.length >= quizQuestions.length
      ? calculateQuizResult(relevantAnswers)
      : null
  }, [selfAnswers, quizQuestions, quiz?.id, user])

  useEffect(() => {
    if (user && selfAnswers) {
      const existingAnswers: Answers = {}
      const lockedQuestions = new Set<number>()
      quizQuestions.forEach((question) => {
        const selfAnswer = selfAnswers.find(
          (sa) =>
            sa.userId === user.id &&
            sa.questionId === question.id &&
            sa.quizId === quiz?.id
        )
        if (selfAnswer) {
          existingAnswers[question.id] = {
            secondPersonLabel:
              question.options[selfAnswer.optionIndex].label.secondPerson,
            side: question.options[selfAnswer.optionIndex].side,
          }
          lockedQuestions.add(question.id)
        }
        // We don't set undefined for unanswered questions anymore
      })
    }
  }, [user, selfAnswers, quiz?.id]) // don't put quiz questions in here for some reason

  useEffect(() => {
    setAllQuestionsAnswered(
      quizQuestions.every((question) => answers[question.id] !== undefined)
    )
  }, [answers, quizQuestions])

  const handleOptionSelect = (
    questionId: number,
    option: { secondPersonLabel: string; side: Side }
  ) => {
    if (!lockedAnswers.has(questionId)) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: option,
      }))
      setShowWarning(false)
    }
  }

  const triggerHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch (error) {
      console.error("Failed to trigger haptic:", error)
    }
  }

  const handleSubmit = async () => {
    if (allQuestionsAnswered && user) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)
      triggerHaptic()

      try {
        const newSelfAnswersPromises = quizQuestions.map(async (question) => {
          if (!lockedAnswers.has(question.id)) {
            const selectedOption = answers[question.id]
            if (selectedOption) {
              const optionIndex = question.options.findIndex(
                (opt) =>
                  opt.label.secondPerson === selectedOption.secondPersonLabel &&
                  opt.side === selectedOption.side
              )
              const newSelfAnswerId = await addSelfAnswer(
                question.id,
                optionIndex
              )
              if (newSelfAnswerId) {
                return {
                  id: Number(newSelfAnswerId),
                  userId: user.id,
                  questionId: question.id,
                  optionIndex,
                  quizId: quiz?.id,
                } as SelfAnswer
              }
            }
          }
          return null
        })

        setSubmitSuccess(true)
      } catch (error) {
        console.error("Failed to submit quiz:", error)
        setSubmitError("An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setShowWarning(true)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF", paddingTop: 60 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={popPage}
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 1,
          }}
        >
          <ChevronLeft size={32} color="#000000" />
        </TouchableOpacity>

        <View style={{ marginBottom: 24, alignItems: "center" }}>
          {quiz && (
            <Image
              source={quiz?.src as ImageSourcePropType}
              style={{
                width: 200,
                height: 200,
                borderRadius: 16,
                marginBottom: 16,
              }}
              resizeMode="cover"
            />
          )}
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "#000000",
              textAlign: "center",
            }}
          >
            {quiz?.name}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#666666",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {quiz?.subtitle.secondPerson}
          </Text>
        </View>

        {quizQuestions.map((question) => (
          <QuestionView
            key={question.id}
            answers={answers}
            lockedAnswers={lockedAnswers}
            handleOptionSelect={handleOptionSelect}
            question={question}
            index={question.id}
          />
        ))}

        {quizResult !== null && quiz && (
          <ResultSlider
            quiz={quiz}
            quizResult={quizResult}
            friendsWhoTookQuiz={[]}
            friends={friends}
          />
        )}

        {quizResult === null ? (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
            style={{
              marginTop: 0,
              marginBottom: 15,
              backgroundColor:
                allQuestionsAnswered && !isSubmitting ? "#007AFF" : "#E0E0E0",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={popPage}
            style={{
              marginTop: 10,
              backgroundColor: "#E0E0E0",
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} color="#000000" style={{ marginRight: 8 }} />
            <Text style={{ color: "#000000", fontWeight: "bold" }}>Back</Text>
          </TouchableOpacity>
        )}

        {showWarning && (
          <CustomAlert
            title="Warning"
            description="Please answer all questions before submitting."
            variant="warning"
          />
        )}
        {submitError && (
          <CustomAlert
            title="Error"
            description={submitError}
            variant="warning"
          />
        )}
      </ScrollView>
    </View>
  )
}

export default TakeQuizView
