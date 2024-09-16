import React, { useEffect, useState, useMemo, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from "react-native"
import { Question, questions, quizzes } from "../../components/questions"
import { useFriends } from "@/contexts/FriendsContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useNotification } from "@/contexts/NotificationContext"
import { addFriendAnswerInitiatedNotification } from "@/contexts/addNotification"
import * as Haptics from "expo-haptics"
import CompletionScreen from "@/components/stack/CompletionPopup"

const { width } = Dimensions.get("window")

interface CardState {
  currentFriendId: number | null
  currentQuestionId: number | null
  nextFriendId: number | null
  nextQuestionId: number | null
}

export default function App() {
  const { friends } = useFriends()
  const { friendAnswers, addFriendAnswer, isLoading } = useFriendAnswers()
  const [cardState, setCardState] = useState<CardState>({
    currentFriendId: null,
    currentQuestionId: null,
    nextFriendId: null,
    nextQuestionId: null,
  })
  const [addError, setAddError] = useState<string | undefined>()
  const { user } = useUser()
  const { notifications, addNotification } = useNotification()
  const { selfAnswers } = useSelfAnswers()
  const [completedQuizFriendId, setCompletedQuizFriendId] = useState<
    number | undefined
  >(undefined)
  const [completedQuizId, setCompletedQuizId] = useState<number | undefined>()
  const [completionAnimation] = useState(new Animated.Value(0))
  const slideAnimation = useRef(new Animated.Value(0)).current
  const fadeAnimation = useRef(new Animated.Value(1)).current

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
    if (newFriendId !== null) {
      const newQuestionId = selectRandomQuestion(
        newFriendId,
        cardState.currentQuestionId
      )
      return { newFriendId, newQuestionId }
    }
    return null
  }

  useEffect(() => {
    if (
      friends.length > 0 &&
      (cardState.currentFriendId === null ||
        cardState.currentQuestionId === null)
    ) {
      const newState = selectNewFriendAndQuestion()
      if (newState) {
        setCardState((prevState) => ({
          ...prevState,
          currentFriendId: newState.newFriendId,
          currentQuestionId: newState.newQuestionId,
        }))
      }
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

  const animateCardAway = () => {
    const newState = selectNewFriendAndQuestion()

    Animated.parallel([
      Animated.timing(slideAnimation, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnimation.setValue(0)
      fadeAnimation.setValue(1)
      if (newState) {
        setCardState((prevState) => ({
          currentFriendId: prevState.nextFriendId,
          currentQuestionId: prevState.nextQuestionId,
          nextFriendId: newState.newFriendId,
          nextQuestionId: newState.newQuestionId,
        }))
      }
    })
  }

  const handleAnswer = async (optionIndex: number) => {
    if (
      cardState.currentFriendId === null ||
      cardState.currentQuestionId === null
    )
      return

    const quizId =
      questions.find((q) => q.id === cardState.currentQuestionId)?.quizId || 0

    try {
      addFriendAnswer(
        cardState.currentFriendId,
        cardState.currentQuestionId,
        optionIndex
      )
      const result = addFriendAnswerInitiatedNotification(
        friendAnswers,
        selfAnswers,
        quizId,
        cardState.currentFriendId,
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

      const newState = selectNewFriendAndQuestion()
      if (newState) {
        setCardState((prevState) => ({
          ...prevState,
          nextFriendId: newState.newFriendId,
          nextQuestionId: newState.newQuestionId,
        }))
      }

      animateCardAway()
    } catch (error) {
      setAddError(JSON.stringify(error))
      console.error("Failed to add answer:", error)
    }
  }

  const handleContinue = () => {
    setCompletedQuizFriendId(undefined)
    setCompletedQuizId(undefined)
    const newState = selectNewFriendAndQuestion()
    if (newState) {
      setCardState((prevState) => ({
        ...prevState,
        nextFriendId: newState.newFriendId,
        nextQuestionId: newState.newQuestionId,
      }))
    }
  }

  const isOutOfQuestions = useMemo(() => {
    return friends.every((friend) => {
      const answeredQuestionIds = filteredFriendAnswers
        .filter((a) => a.selfId === friend.id)
        .map((a) => a.questionId)
      return availableQuestions.every((q) => answeredQuestionIds.includes(q.id))
    })
  }, [friends, filteredFriendAnswers])

  const renderCardContents = (current: boolean) => {
    const friendId = current
      ? cardState.currentFriendId
      : cardState.nextFriendId
    const questionId = current
      ? cardState.currentQuestionId
      : cardState.nextQuestionId
    const friend = friends.find((f) => f.id === friendId)
    const question = questions.find((q) => q.id === questionId)
    const quiz = quizzes.find((q) => q.id === question?.quizId)

    return (
      <>
        <Text style={styles.name}>{friend?.name}</Text>
        <Text style={styles.question}>{question?.thirdPersonLabel}</Text>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <View style={{ width: "100%", paddingHorizontal: 20 }}>
            {question?.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handleAnswer(index)}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        {quiz && (
          <View style={styles.quizInfoContainer}>
            <Image source={quiz.src} style={styles.quizImage} />
            <Text style={styles.quizName}>{`From the ${quiz.name}`}</Text>
          </View>
        )}
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.explanationText}>
        Answer questions about your friendsx to see what they said about
        themselves.
      </Text>
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
            {
              opacity: completedQuizFriendId !== undefined ? 0.5 : 1,
            },
          ]}
        >
          <View style={styles.cardStack}>
            <View style={[styles.stackedCard, styles.bottomCard]} />
            <View style={[styles.stackedCard, styles.middleCard]} />
            <View style={[styles.cardContainer, { position: "absolute" }]}>
              {renderCardContents(false)}
            </View>
            <Animated.View
              style={[
                styles.cardContainer,
                {
                  transform: [{ translateX: slideAnimation }],
                },
              ]}
            >
              {renderCardContents(true)}
            </Animated.View>
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
    bottom: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  cardStack: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  stackedCard: {
    position: "absolute",
    width: "100%",
    height: "90%",
    borderWidth: 3,
    borderColor: "#111419",
    borderRadius: 30,
    backgroundColor: "#262C34",
  },
  bottomCard: {
    top: 50,
    width: "90%",
  },
  middleCard: {
    top: 40,
    width: "95%",
  },
  cardContainer: {
    width: "100%",
    height: "90%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#111419",
    padding: 0,
    borderRadius: 30,
    paddingHorizontal: 0,
    backgroundColor: "#262C34",
    zIndex: 3,
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
  quizInfoContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    borderTopColor: "#111419",
    borderTopWidth: 2,
    width: "100%",
    paddingTop: 15,
  },
  quizImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 10,
  },
  quizName: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  explanationText: {
    fontSize: 16,
    color: "#79818D",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: -20,
    width: "100%",
  },
})
