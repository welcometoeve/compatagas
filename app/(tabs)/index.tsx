import React, { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native"
import { Question, questions, quizzes } from "../../components/questions"
import { useFriends } from "@/contexts/FriendsContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"

export default function App() {
  const { friends } = useFriends()
  const { friendAnswers, addFriendAnswer, isLoading } = useFriendAnswers()
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  )
  const [currentFriendId, setCurrentFriendId] = useState<number | null>(null)
  const [addError, setAddError] = useState<string | undefined>()
  const { user } = useUser()

  // only offer questions that have been answered by another user
  const availableQuestions: Question[] = questions
  // .filter(
  //   (question) =>
  //     !!selfAnswers.find(
  //       (answer) =>
  //         answer.questionId === question.id && answer.userId !== user?.id
  //     )
  // )

  // only consider answers from the current user
  const filteredFriendAnswers = friendAnswers.filter(
    (answer) => answer.friendId === user?.id
  )

  const selectRandomFriend = () => {
    const availableFriends = friends.filter((friend) =>
      availableQuestions.some(
        (q) =>
          !filteredFriendAnswers.some(
            (a) => a.selfId === friend.id && a.questionId === q.id
          )
      )
    )

    if (availableFriends.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableFriends.length)
      return availableFriends[randomIndex].id
    }
    return null
  }

  const selectRandomQuestion = (
    friendId: number,
    currentQuestionId: number | null
  ) => {
    const unansweredQuestions = availableQuestions.filter(
      (q) =>
        !filteredFriendAnswers.some(
          (a) => a.selfId === friendId && a.questionId === q.id
        ) && q.id !== currentQuestionId
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
      const newQuestionId = selectRandomQuestion(newFriendId, currentQuestionId)
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
  }, [friends, filteredFriendAnswers])

  const handleAnswer = async (optionIndex: number) => {
    if (currentFriendId === null || currentQuestionId === null) return

    try {
      addFriendAnswer(currentFriendId, currentQuestionId, optionIndex)
      selectNewFriendAndQuestion()
    } catch (error) {
      setAddError(JSON.stringify(error))
      console.error("Failed to add answer:", error)
    }
  }

  const currentQuestion = availableQuestions.find(
    (q) => q.id === currentQuestionId
  )
  const currentFriend = friends.find((f) => f.id === currentFriendId)

  const isOutOfQuestions = useMemo(() => {
    return friends.every((friend) => {
      const answeredQuestionIds = filteredFriendAnswers
        .filter((a) => a.selfId === friend.id)
        .map((a) => a.questionId)
      return availableQuestions.every((q) => answeredQuestionIds.includes(q.id))
    })
  }, [friends, filteredFriendAnswers])

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
                onPress={() => {
                  handleAnswer(index)
                }}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            {/* {addError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{addError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => handleAnswer(0)}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            )} */}
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
