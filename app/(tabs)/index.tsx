import React, { useEffect, useState, useMemo } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native"
import { Question, questions, quizzes } from "../../components/questions"
import { useFriends } from "@/contexts/FriendsContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useNotification } from "@/contexts/NotificationContext"
import { addFriendAnswerInitiatedNotification } from "@/contexts/addNotification"
import * as Haptics from "expo-haptics"
import CompletionScreen from "@/components/questionStack/CompletionPopup"

export default function App() {
  const { friends } = useFriends()
  const { friendAnswers, addFriendAnswer, isLoading } = useFriendAnswers()
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null
  )
  const [currentFriendId, setCurrentFriendId] = useState<number | null>(null)
  const [addError, setAddError] = useState<string | undefined>()
  const { user } = useUser()
  const { notifications, addNotification } = useNotification()
  const { selfAnswers } = useSelfAnswers()
  const [completedQuizFriendId, setCompletedQuizFriendId] = useState<
    number | undefined
  >(undefined)
  const [completedQuizId, setCompletedQuizId] = useState<number | undefined>()
  const [completionAnimation] = useState(new Animated.Value(0))

  const availableQuestions: Question[] = questions

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

  const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle) => {
    try {
      await Haptics.impactAsync(style)
    } catch (error) {
      console.error("Failed to trigger haptic:", error)
    }
  }

  const startCompletionAnimation = () => {
    Animated.timing(completionAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }

  useEffect(() => {
    if (completedQuizFriendId !== undefined) {
      startCompletionAnimation()
    }
  }, [completedQuizFriendId])

  const handleAnswer = async (optionIndex: number) => {
    if (currentFriendId === null || currentQuestionId === null) return

    const quizId =
      questions.find((q) => q.id === currentQuestionId)?.quizId || 0

    try {
      addFriendAnswer(currentFriendId, currentQuestionId, optionIndex)
      const result = addFriendAnswerInitiatedNotification(
        friendAnswers,
        selfAnswers,
        quizId,
        currentFriendId,
        user ? user.id : 0,
        addNotification
      )
      if (result !== undefined) {
        await triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy)
        setCompletedQuizFriendId(result.friendId)
        setCompletedQuizId(result.quizId)
      } else {
        await triggerHaptic(Haptics.ImpactFeedbackStyle.Light)
      }

      selectNewFriendAndQuestion()
    } catch (error) {
      setAddError(JSON.stringify(error))
      console.error("Failed to add answer:", error)
    }
  }

  const handleContinue = () => {
    setCompletedQuizFriendId(undefined)
    setCompletedQuizId(undefined)
    selectNewFriendAndQuestion()
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

  return (
    <SafeAreaView style={styles.container}>
      {isOutOfQuestions ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            <Text style={styles.outOfQuestionsText}>
              Out of questions for now!
            </Text>
          </View>
        </SafeAreaView>
      ) : (
        <View
          style={[
            styles.contentContainer,
            { opacity: completedQuizFriendId !== undefined ? 0.5 : 1 },
          ]}
        >
          <View style={styles.cardContainer}>
            <Text style={styles.name}>{currentFriend?.name}</Text>
            <Text style={styles.question}>
              {currentQuestion?.thirdPersonLabel}
            </Text>
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
              </>
            )}
          </View>
        </View>
      )}

      {completedQuizFriendId !== undefined && (
        <CompletionScreen
          completionAnimation={completionAnimation}
          completedQuizName={
            quizzes.find((q) => q.id === completedQuizId)?.name || ""
          }
          completedFriendName={
            friends.find((f) => f.id === completedQuizFriendId)?.name || ""
          }
          onDismiss={() => setCompletedQuizFriendId(undefined)}
          onContinue={handleContinue}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111419",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#656D7A",
    padding: 30,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "white",
    width: "100%",
  },
  button: {
    backgroundColor: "#FF4457",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  outOfQuestionsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
})
