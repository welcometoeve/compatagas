import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { AlertTriangle, ChevronLeft, CheckCircle } from "lucide-react-native"
import { Question, Quiz, Side } from "@/components/questions"
import { useUser } from "@/contexts/UserContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"

type QuizViewProps = {
  quiz: Quiz
  questions: Question[]
  goBack: () => void
}

type Answers = {
  [key: number]: { label: string; side: Side }
}

const CustomAlert: React.FC<{
  title: string
  description: string
  variant: "warning" | "info" | "success"
}> = ({ title, description, variant }) => (
  <View
    style={{
      padding: 16,
      borderRadius: 8,
      backgroundColor:
        variant === "warning"
          ? "#7c2d12"
          : variant === "success"
          ? "#065f46"
          : "#1f2937",
      borderColor:
        variant === "warning"
          ? "#ca8a04"
          : variant === "success"
          ? "#10b981"
          : "#a78bfa",
      borderWidth: 1,
      marginTop: 16,
    }}
  >
    {variant === "warning" && (
      <AlertTriangle size={16} color="white" style={{ marginBottom: 8 }} />
    )}
    {variant === "success" && (
      <CheckCircle size={16} color="white" style={{ marginBottom: 8 }} />
    )}
    <Text style={{ fontWeight: "bold", color: "white" }}>{title}</Text>
    <Text style={{ color: "white" }}>{description}</Text>
  </View>
)

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
  const { user } = useUser()

  useEffect(() => {
    // Initialize answers with existing self-answers and lock them
    if (user && selfAnswers) {
      const existingAnswers: Answers = {}
      const lockedQuestions = new Set<number>()
      questions.forEach((question) => {
        const selfAnswer = selfAnswers.find(
          (sa) => sa.userId === user.id && sa.questionId === question.id
        )
        if (selfAnswer !== undefined) {
          existingAnswers[question.id] =
            question.options[selfAnswer.optionIndex]
          lockedQuestions.add(question.id)
        }
      })
      setAnswers(existingAnswers)
      setLockedAnswers(lockedQuestions)

      // Calculate quiz result if all questions are answered
      if (lockedQuestions.size === questions.length) {
        calculateQuizResult(existingAnswers)
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

  const calculateQuizResult = (finalAnswers: Answers) => {
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

  const handleSubmit = async () => {
    if (allQuestionsAnswered && user) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)

      try {
        const submissionPromises = questions.map((question) => {
          if (!lockedAnswers.has(question.id)) {
            const selectedOption = answers[question.id]
            const optionIndex = question.options.findIndex(
              (opt) =>
                opt.label === selectedOption.label &&
                opt.side === selectedOption.side
            )
            return addSelfAnswer(question.id, optionIndex)
          }
          return Promise.resolve()
        })

        const results = await Promise.all(submissionPromises)
        const errors = results.filter((result: any) => result !== undefined)

        if (errors.length > 0) {
          setSubmitError(`Failed to submit ${errors.length} answer(s)`)
        } else {
          setSubmitSuccess(true)
          calculateQuizResult(answers)
        }
      } catch (error) {
        setSubmitError("An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setShowWarning(true)
    }
  }

  const renderSlider = () => {
    if (quizResult === null) return null

    const sliderPosition = ((quizResult + 1) / 2) * 100
    const leftPosition = `${sliderPosition}%`

    return (
      <View style={{ marginTop: 24, marginBottom: 24 }}>
        <Text style={{ color: "white", marginBottom: 8, textAlign: "center" }}>
          Your Result
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ color: "white" }}>{quiz.leftLabel}</Text>
          <Text style={{ color: "white" }}>{quiz.rightLabel}</Text>
        </View>
        <View
          style={{
            height: 20,
            backgroundColor: "rgb(40, 40, 40)",
            borderRadius: 10,
            marginTop: 8,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: `${sliderPosition}%`,
              transform: [{ translateX: -14 }],
              marginTop: -4,
              width: 28,
              height: 28,
              backgroundColor: "#8b5cf6",
              borderRadius: 14,
            }}
          />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 24, paddingBottom: 0 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              width: "100%",
            }}
          >
            {quiz.name}
          </Text>
          <TouchableOpacity
            onPress={goBack}
            style={{ marginRight: 16, position: "absolute" }}
          >
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
        </View>

        {questions.map((question) => (
          <View key={question.id} style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 8,
                color: "white",
              }}
            >
              {question.label}
            </Text>
            <View>
              {question.options.map((option, index) => {
                const isSelected =
                  answers[question.id]?.label === option.label &&
                  answers[question.id]?.side === option.side
                const isLocked = lockedAnswers.has(question.id)

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleOptionSelect(question.id, option)
                    }}
                    disabled={isLocked}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor:
                        isSelected && !isLocked
                          ? "#7c3aed"
                          : isSelected
                          ? "#8b5cf6"
                          : "rgb(40, 40, 40)",
                      marginBottom: 8,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: !isLocked
                        ? "transparent"
                        : isSelected
                        ? "#8b5cf6"
                        : "gray",
                    }}
                  >
                    <Text style={{ color: "white" }}>{option.label}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        ))}

        {renderSlider()}

        {quizResult === null ? (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!allQuestionsAnswered || isSubmitting}
            style={{
              marginTop: 24,
              backgroundColor:
                allQuestionsAnswered && !isSubmitting
                  ? "#8b5cf6"
                  : "rgb(50, 50, 50)",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Submit Quiz
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={goBack}
            style={{
              marginTop: 24,
              backgroundColor: "rgb(40, 40, 40)",
              padding: 12,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronLeft size={20} color="white" style={{ marginRight: 8 }} />
            <Text style={{ color: "white", fontWeight: "bold" }}>Back</Text>
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

        {submitSuccess && (
          <CustomAlert
            title="Success"
            description="Your answers have been submitted successfully."
            variant="success"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default QuizView
