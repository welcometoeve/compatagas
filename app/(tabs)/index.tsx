import React, { useEffect, useState, useRef } from "react"
import { View, StyleSheet, Animated, Dimensions } from "react-native"
import { questions, quizzes } from "../../constants/questions"
import { useUser } from "@/contexts/UserContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useNotification } from "@/contexts/NotificationContext"
import { addFriendAnswerInitiatedNotification } from "@/contexts/addNotification"
import * as Haptics from "expo-haptics"
import {
  CardContents,
  CardStack,
  CompletionScreen,
  ExplanationText,
  OutOfQuestionsView,
} from "@/components/stack/StackComponents"
import { useFriendQuestionSelection } from "@/components/stack/useFriendSelection"

const { width } = Dimensions.get("window")

export default function App() {
  const { friendAnswers, addFriendAnswer, isLoading } = useFriendAnswers()
  const { user, allUsers } = useUser()
  const { addNotification, notifications } = useNotification()
  const [addError, setAddError] = useState<string | undefined>()
  const [completedQuizFriendId, setCompletedQuizFriendId] = useState<
    number | undefined
  >(undefined)
  const [completedQuizId, setCompletedQuizId] = useState<number | undefined>()
  const [completionAnimation] = useState(new Animated.Value(0))
  const slideAnimation = useRef(new Animated.Value(0)).current
  const fadeAnimation = useRef(new Animated.Value(1)).current

  const {
    cardState,
    setCardState,
    selectNewFriendAndQuestion,
    friends,
    availableQuestions,
    filteredFriendAnswers,
  } = useFriendQuestionSelection()

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
        allUsers,
        friendAnswers,
        [], // selfAnswers is not used in this component, so passing an empty array
        quizId,
        cardState.currentFriendId,
        user ? user.id : 0,
        notifications,
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

  const isOutOfQuestions = friends.every((friend) => {
    const answeredQuestionIds = filteredFriendAnswers
      .filter((a) => a.selfId === friend.id)
      .map((a) => a.questionId)
    return availableQuestions.every((q) => answeredQuestionIds.includes(q.id))
  })

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
      <CardContents
        friend={friend}
        question={question}
        quiz={quiz}
        isLoading={isLoading}
        handleAnswer={handleAnswer}
      />
    )
  }

  const completedQuiz = quizzes.find((q) => q.id === completedQuizId)

  if (
    cardState.currentFriendId === null ||
    cardState.currentQuestionId === null ||
    isLoading
  ) {
    return null
  }

  return (
    <View style={styles.container}>
      <ExplanationText />
      {isOutOfQuestions ? (
        <OutOfQuestionsView />
      ) : (
        <View
          style={[
            styles.contentContainer,
            {
              opacity: completedQuizFriendId !== undefined ? 0.5 : 1,
            },
          ]}
        >
          <CardStack
            renderCardContents={renderCardContents}
            slideAnimation={slideAnimation}
          />
        </View>
      )}

      {completedQuiz !== undefined && completedQuizFriendId && (
        <CompletionScreen
          completionAnimation={completionAnimation}
          completedQuiz={completedQuiz}
          completedQuizSelfId={completedQuizFriendId}
          onDismiss={() => setCompletedQuizFriendId(undefined)}
          onContinue={handleContinue}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
})
