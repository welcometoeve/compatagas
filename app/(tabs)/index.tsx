import React, { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native"
import { questions } from "../../constants/questions"
import { useFriends } from "@/contexts/FriendsContext"
import { useAnswers } from "@/contexts/AnswerContext"

export type Answer = {
  id: number
  answererId: number
  userItsAboutId: number
  questionId: number
  optionIndex: number
}

export type Question = {
  id: number
  label: string
  options: string[]
}

export default function App() {
  const { friends } = useFriends()
  const { answers, addAnswer, isLoading } = useAnswers()
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  )
  const [currentFriendId, setCurrentFriendId] = useState<number | null>(null)
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([])
  const [addError, setAddError] = useState<string | undefined>()

  const updateAvailableQuestions = (friendId: number) => {
    const answeredQuestionIds = answers
      .filter((a) => a.userItsAboutId === friendId)
      .map((a) => a.questionId)

    const newAvailableQuestions = questions.filter(
      (q) => !answeredQuestionIds.includes(q.id)
    )
    setAvailableQuestions(newAvailableQuestions)
  }

  const selectRandomFriend = () => {
    const availableFriends = friends.filter((friend) =>
      questions.some(
        (q) =>
          !answers.some(
            (a) => a.userItsAboutId === friend.id && a.questionId === q.id
          )
      )
    )
    if (availableFriends.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableFriends.length)
      return availableFriends[randomIndex].id
    }
    return null
  }

  const selectRandomQuestion = (friendId: number) => {
    const unansweredQuestions = questions.filter(
      (q) =>
        !answers.some(
          (a) => a.userItsAboutId === friendId && a.questionId === q.id
        )
    )
    if (unansweredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * unansweredQuestions.length)
      return unansweredQuestions[randomIndex].id
    }
    return null
  }

  const selectNewFriendAndQuestion = () => {
    const newFriendId = selectRandomFriend()
    setCurrentFriendId(newFriendId)
    if (newFriendId !== null) {
      updateAvailableQuestions(newFriendId)
      const newQuestionId = selectRandomQuestion(newFriendId)
      setCurrentQuestionId(newQuestionId)
    }
  }

  useEffect(() => {
    if (
      friends.length > 0 &&
      (currentFriendId === null || currentQuestionId === null)
    ) {
      selectNewFriendAndQuestion()
    }
  }, [friends, answers])

  const handleAnswer = async (optionIndex: number) => {
    if (currentFriendId === null || currentQuestionId === null) return

    try {
      addAnswer(currentFriendId, currentQuestionId, optionIndex) // figure out what to do with errors later
      // setAddError(error)
      // if (error) return

      // If successful, move to the next friend and question
      selectNewFriendAndQuestion()
    } catch (error) {
      setAddError(JSON.stringify(error))
      console.error("Failed to add answer:", error)
    }
  }

  const currentQuestion = questions.find((q) => q.id === currentQuestionId)
  const currentFriend = friends.find((f) => f.id === currentFriendId)

  const isOutOfQuestions = useMemo(() => {
    return friends.every((friend) => {
      const answeredQuestionIds = answers
        .filter((a) => a.userItsAboutId === friend.id)
        .map((a) => a.questionId)
      return questions.every((q) => answeredQuestionIds.includes(q.id))
    })
  }, [friends, answers])

  if (isOutOfQuestions) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.outOfQuestionsText}>
            Out of questions for now!
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{currentFriend?.name}</Text>
        <Text style={styles.question}>{currentQuestion?.label}</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            {currentQuestion?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handleAnswer(index)}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{option}</Text>
              </TouchableOpacity>
            ))}
            {addError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{addError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => handleAnswer(0)}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: "35%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#E0E0E0",
  },
  button: {
    backgroundColor: "#BB86FC",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
  },
  buttonText: {
    color: "#000000",
    textAlign: "center",
    fontSize: 16,
  },
  outOfQuestionsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  errorContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
})
