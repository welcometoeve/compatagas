import { useState, useEffect, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  ImageSourcePropType,
} from "react-native"
import { ChevronLeft } from "lucide-react-native"
import { Question, Side } from "@/constants/questions/types"
import { useUser } from "@/contexts/UserContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { CustomAlert } from "./CustomAlert"
import QuestionView from "./QuestionView"
import ResultSlider from "./QuizResultsWithoutFriendsView"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import * as Haptics from "expo-haptics"
import { useFriends } from "@/contexts/FriendsContext"
import { insertName, questions, quizzes } from "@/constants/questions/questions"
import { usePage } from "@/contexts/PageContext"
import React = require("react")

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
  const [lockedAnswers, setLockedAnswers] = useState<Set<number>>(new Set())
  const [showWarning, setShowWarning] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { popPage } = usePage()
  const { addSelfAnswer, selfAnswers } = useSelfAnswers()
  const { user } = useUser()
  const { allUsers } = useFriends()
  const { addFriendAnswer, friendAnswers } = useFriendAnswers()
  const isForYou = userId === user?.id
  const personName = allUsers.find((u) => u.id === userId)?.name || "Friend"
  const quiz = quizzes.find((quiz) => quiz.id === quizId)
  const quizQuestions: Question[] = questions.filter(
    (question) => question.quizId === quizId
  )

  const [answers, setAnswers] = useState<
    {
      questionId: number
      optionIndex: number
    }[]
  >(
    selfAnswers
      .filter((sa) => sa.userId === user?.id && sa.quizId === quiz?.id)
      .map((sa) => ({
        questionId: sa.questionId,
        optionIndex: sa.optionIndex,
      }))
  )
  const [isSubmitted, setIsSubmitted] = useState(
    answers.length >= quizQuestions.length
  )

  const quizResult = useMemo(() => {
    const calculateQuizResult = (
      answers: {
        questionId: number
        optionIndex: number
      }[]
    ) => {
      let totalScore = 0
      quizQuestions.forEach((question) => {
        const answer = answers.find((sa) => sa.questionId === question.id)
        if (answer) {
          const optionIndex = answer.optionIndex
          const side = question.options[optionIndex].side
          const score = side === "neither" ? 0 : side === "left" ? -1 : 1

          totalScore += score
        }
      })
      const averageScore = totalScore / quizQuestions.length
      return averageScore
    }

    return answers.length >= quizQuestions.length
      ? calculateQuizResult(answers)
      : null
  }, [isSubmitted])

  useEffect(() => {
    setAllQuestionsAnswered(
      quizQuestions.every((question) => answers[question.id] !== undefined)
    )
  }, [answers, quizQuestions])

  const triggerHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch (error) {
      console.error("Failed to trigger haptic:", error)
    }
  }

  const handleSubmit = async () => {
    if (user) {
      setIsSubmitting(true)
      setSubmitError(null)
      triggerHaptic()

      try {
        const newSelfAnswersPromises = quizQuestions.map(async (question) => {
          const optionIndex = answers.find(
            (q) => q.questionId === question.id
          )?.optionIndex

          if (optionIndex !== undefined) {
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
          return null
        })

        const newSelfAnswers = (
          await Promise.all(newSelfAnswersPromises)
        ).filter((sa) => !!sa)

        if (newSelfAnswers.length >= quizQuestions.length) {
          setIsSubmitted(true)
        } else {
          throw new Error("Failed to submit quiz")
        }
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
            {isForYou
              ? quiz?.subtitle.secondPerson
              : insertName(quiz?.subtitle.thirdPerson ?? "", personName)}
          </Text>
        </View>

        {quizQuestions.map((question) => (
          <QuestionView
            key={question.id}
            answer={answers.find((a) => {
              return a.questionId == question.id
            })}
            isDone={isSubmitted}
            question={question}
            index={question.id}
            selfId={userId}
            setAnswer={(answer) =>
              setAnswers(
                answers
                  .filter((a) => a.questionId !== answer.questionId)
                  .concat(answer)
              )
            }
          />
        ))}

        {quizResult !== null && quiz && (
          <ResultSlider
            quiz={quiz}
            quizResult={quizResult}
            friendsWhoTookQuiz={[]}
            selfId={userId}
          />
        )}

        {quizResult === null ? (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={answers.length < quizQuestions.length || isSubmitting}
            style={{
              marginTop: 0,
              marginBottom: 15,
              backgroundColor:
                answers.length >= quizQuestions.length && !isSubmitting
                  ? "#007AFF"
                  : "#E0E0E0",
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
