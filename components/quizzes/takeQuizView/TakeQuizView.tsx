import React, { useState, useEffect } from "react"
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
import { Question, Quiz, Side } from "@/components/questions"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { CustomAlert } from "./CustomAlert"
import QuestionView from "./QuestionView"
import ResultSlider from "./QuizResultsWithoutFriendsView"
import { addSelfAnswerInitiatedNotification } from "@/contexts/addNotification"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useNotification } from "@/contexts/NotificationContext"
import * as Haptics from "expo-haptics"
import collect from "@/components/collect"
import { SafeAreaView } from "react-native-safe-area-context"

export type SelfAnswer = {
  id: number
  userId: number
  questionId: number
  optionIndex: number
  quizId: number
}

type QuizViewProps = {
  quiz: Quiz
  questions: Question[]
  goBack: () => void
}

type Answers = {
  [key: number]: { label: string; side: Side }
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, questions, goBack }) => {
  const [answers, setAnswers] = useState<Answers>({})
  const [lockedAnswers, setLockedAnswers] = useState<Set<number>>(new Set())
  const [showWarning, setShowWarning] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [quizResult, setQuizResult] = useState<number | null>(null)

  const { addSelfAnswer, selfAnswers } = useSelfAnswers()
  const { user, allUsers } = useUser()
  const { friendAnswers } = useFriendAnswers()
  const { addNotification, notifications } = useNotification()

  const friendsWhoTookQuiz = collect(
    friendAnswers.filter(
      (fa) => fa.selfId === user?.id && fa.quizId === quiz.id
    ),
    ["friendId"]
  )
    .filter((g) => g.length >= questions.length)
    .map((g) => g[0].friendId)

  useEffect(() => {
    if (user && selfAnswers) {
      const existingAnswers: Answers = {}
      const lockedQuestions = new Set<number>()
      const relevantSelfAnswers: SelfAnswer[] = []

      questions.forEach((question) => {
        const selfAnswer = selfAnswers.find(
          (sa) => sa.userId === user.id && sa.questionId === question.id
        )
        if (selfAnswer) {
          existingAnswers[question.id] =
            question.options[selfAnswer.optionIndex]
          lockedQuestions.add(question.id)
          relevantSelfAnswers.push(selfAnswer)
        }
      })

      setAnswers(existingAnswers)
      setLockedAnswers(lockedQuestions)

      if (relevantSelfAnswers.length === questions.length) {
        calculateQuizResult(relevantSelfAnswers)
      }
    }
  }, [user, selfAnswers, questions])

  useEffect(() => {
    setAllQuestionsAnswered(Object.keys(answers).length === questions.length)
  }, [answers, questions])

  const handleOptionSelect = (
    questionId: number,
    option: { label: string; side: Side }
  ) => {
    if (!lockedAnswers.has(questionId)) {
      setAnswers((prevAnswers) => ({
        ...prevAnswers,
        [questionId]: option,
      }))
      setShowWarning(false)
    }
  }

  const calculateQuizResult = (selfAnswers: SelfAnswer[]) => {
    let totalScore = 0
    questions.forEach((question) => {
      const selfAnswer = selfAnswers.find((sa) => sa.questionId === question.id)
      if (selfAnswer) {
        const optionIndex = selfAnswer.optionIndex
        const side = question.options[optionIndex].side
        const score = side === Side.NEITHER ? 0 : Side.LEFT ? -1 : 1
        totalScore += score
      }
    })
    const averageScore = totalScore / questions.length
    setQuizResult(averageScore)
  }

  const triggerHaptic = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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
        const newSelfAnswersPromises = questions.map(async (question) => {
          if (!lockedAnswers.has(question.id)) {
            const selectedOption = answers[question.id]
            const optionIndex = question.options.findIndex(
              (opt) =>
                opt.label === selectedOption.label &&
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
                quizId: quiz.id,
              } as SelfAnswer
            }
          }
          return null
        })

        const newSelfAnswers = (
          await Promise.all(newSelfAnswersPromises)
        ).filter((answer): answer is SelfAnswer => answer !== null)

        const fs = await addSelfAnswerInitiatedNotification(
          quiz.id,
          friendAnswers,
          user,
          allUsers,
          addNotification
        )

        if (fs.length > 0) {
          triggerHaptic()
        }

        setSubmitSuccess(true)

        // Combine existing and new self answers
        const allSelfAnswers = [
          ...(selfAnswers?.filter(
            (sa) =>
              sa.userId === user.id &&
              questions.some((q) => q.id === sa.questionId)
          ) || []),
          ...newSelfAnswers,
        ]
        calculateQuizResult(allSelfAnswers)
      } catch (error) {
        setSubmitError("An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setShowWarning(true)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 20 }}
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
          <ChevronLeft size={32} color="#000000" />
        </TouchableOpacity>

        <View style={{ marginBottom: 24, alignItems: "center" }}>
          <Image
            source={quiz.src as ImageSourcePropType}
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
              fontSize: 32,
              fontWeight: "bold",
              color: "#000000",
              textAlign: "center",
            }}
          >
            {quiz.name}
          </Text>
          <Text
            style={{
              fontSize: 18,
              color: "#666666",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {quiz.subtitle}
          </Text>
        </View>

        {questions.map((question) => (
          <QuestionView
            key={question.id}
            answers={answers}
            lockedAnswers={lockedAnswers}
            handleOptionSelect={handleOptionSelect}
            question={question}
            index={question.id}
          />
        ))}

        {quizResult !== null && (
          <ResultSlider
            quiz={quiz}
            quizResult={quizResult}
            friendsWhoTookQuiz={friendsWhoTookQuiz}
            allUsers={allUsers}
            onPress={() => undefined}
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
            onPress={goBack}
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
    </SafeAreaView>
  )
}

export default QuizView
