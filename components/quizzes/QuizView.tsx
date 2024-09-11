import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native"
import { AlertTriangle, ChevronLeft } from "lucide-react-native"
import { Question, Quiz } from "@/constants/questions"

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
  variant: "warning" | "info"
}> = ({ title, description, variant }) => (
  <View
    style={{
      padding: 16,
      borderRadius: 8,
      backgroundColor: variant === "warning" ? "#7c2d12" : "#1f2937",
      borderColor: variant === "warning" ? "#ca8a04" : "#a78bfa",
      borderWidth: 1,
      marginTop: 16,
    }}
  >
    {variant === "warning" && (
      <AlertTriangle size={16} style={{ marginBottom: 8 }} />
    )}
    <Text style={{ fontWeight: "bold", color: "white" }}>{title}</Text>
    <Text style={{ color: "white" }}>{description}</Text>
  </View>
)

const QuizView: React.FC<QuizViewProps> = ({ quiz, questions, goBack }) => {
  const [answers, setAnswers] = useState<Answers>({})
  const [showWarning, setShowWarning] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false)

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

  const handleSubmit = () => {
    if (allQuestionsAnswered) {
      console.log("Quiz submitted:", answers)
      // Here you would typically send the answers to a backend or process them
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
                  onPress={() => handleOptionSelect(question.id, option)}
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
          disabled={!allQuestionsAnswered}
          style={{
            marginTop: 24,
            backgroundColor: allQuestionsAnswered
              ? "#8b5cf6"
              : "rgb(50, 50, 50)",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Submit Quiz
          </Text>
        </TouchableOpacity>

        {showWarning && (
          <CustomAlert
            title="Warning"
            description="Please answer all questions before submitting."
            variant="warning"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default QuizView
