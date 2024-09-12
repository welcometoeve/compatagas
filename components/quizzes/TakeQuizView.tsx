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
import { Question, Quiz } from "@/constants/questions"
import { useUser } from "@/contexts/UserContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"

type QuizViewProps = {
  quiz: Quiz
  questions: Question[]
  goBack: () => void
}

type Answers = {
  [key: number]: string
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
  const [showWarning, setShowWarning] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const { addSelfAnswer } = useSelfAnswers()
  const { user } = useUser()

  useEffect(() => {
    setAllQuestionsAnswered(Object.keys(answers).length === questions.length)
  }, [answers, questions])

  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: option,
    }))
    setShowWarning(false)
  }

  const handleSubmit = async () => {
    if (allQuestionsAnswered && user) {
      setIsSubmitting(true)
      setSubmitError(null)
      setSubmitSuccess(false)

      try {
        const submissionPromises = questions.map((question) =>
          addSelfAnswer(
            question.id,
            question.options.indexOf(answers[question.id])
          )
        )

        const results = await Promise.all(submissionPromises)
        const errors = results.filter((result: any) => result !== undefined)

        if (errors.length > 0) {
          setSubmitError(`Failed to submit ${errors.length} answer(s)`)
        } else {
          setSubmitSuccess(true)
        }
      } catch (error) {
        setSubmitError("An unexpected error occurred")
      } finally {
        setIsSubmitting(false)
        goBack()
      }
    } else {
      setShowWarning(true)
    }
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
              {question.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleOptionSelect(question.id, option)
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor:
                      answers[question.id] === option
                        ? "#7c3aed"
                        : "rgb(40, 40, 40)",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "white" }}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

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
