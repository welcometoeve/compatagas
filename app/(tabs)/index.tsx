import React, { useEffect, useState, useMemo, useRef } from "react"
import {
  View,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from "react-native"
import { Question, questions, quizzes } from "../../constants/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
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

const { width } = Dimensions.get("window")

interface CardState {
  currentFriendId: number | null
  currentQuestionId: number | null
  nextFriendId: number | null
  nextQuestionId: number | null
}

export default function App() {
  const { friendAnswers, addFriendAnswer, isLoading } = useFriendAnswers()
  const [cardState, setCardState] = useState<CardState>({
    currentFriendId: null,
    currentQuestionId: null,
    nextFriendId: null,
    nextQuestionId: null,
  })
  const [addError, setAddError] = useState<string | undefined>()
  const { user, allUsers } = useUser()
  const { addNotification, notifications } = useNotification()
  const { selfAnswers } = useSelfAnswers()
  const [completedQuizFriendId, setCompletedQuizFriendId] = useState<
    number | undefined
  >(undefined)
  const [completedQuizId, setCompletedQuizId] = useState<number | undefined>()
  const [completionAnimation] = useState(new Animated.Value(0))
  const slideAnimation = useRef(new Animated.Value(0)).current
  const fadeAnimation = useRef(new Animated.Value(1)).current
  const [currentQuizUserCombo, setCurrentQuizUserCombo] = useState<{
    quizId: number
    selfId: number
  } | null>(null)

  const friends = allUsers.filter((u) => u.id !== user?.id)

  const availableQuestions: Question[] = questions

  const filteredFriendAnswers = friendAnswers.filter(
    (answer) => answer.friendId === user?.id
  )

  const quizUserCombos = useMemo(() => {
    return quizzes.flatMap((quiz) => {
      return allUsers.map((user) => {
        return { quizId: quiz.id, selfId: user.id }
      })
    })
  }, [quizzes, allUsers])

  const incompleteQuizUserCombos = useMemo(() => {
    return quizUserCombos.filter(({ quizId, selfId }) => {
      const relevantSelfAnswers = selfAnswers.filter(
        (sa) =>
          sa.quizId === quizId && sa.userId === selfId && sa.userId != user?.id
      )
      const relevantFriendAnswers = friendAnswers.filter(
        (fa) =>
          fa.quizId === quizId &&
          fa.selfId === selfId &&
          fa.friendId === user?.id
      )
      const relevantQuestions = questions.filter((q) => q.quizId === quizId)
      return (
        relevantQuestions.length <= relevantSelfAnswers.length &&
        relevantQuestions.length > relevantFriendAnswers.length
      )
    })
  }, [quizUserCombos, selfAnswers, friendAnswers, questions, user])

  const selectNextQuizUserCombo = () => {
    if (incompleteQuizUserCombos.length > 0) {
      return incompleteQuizUserCombos[0]
    }
    return null
  }

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

  const selectQuestion = (
    friendId: number,
    currentQuestionId: number | null
  ) => {
    const unansweredQuestions = availableQuestions.filter(
      (q) =>
        !filteredFriendAnswers.some(
          (a) => a.selfId === friendId && a.questionId === q.id
        ) &&
        q.id !== currentQuestionId &&
        (currentQuizUserCombo ? q.quizId === currentQuizUserCombo.quizId : true)
    )
    if (unansweredQuestions.length > 0) {
      return unansweredQuestions[0].id
    }
    return null
  }

  const selectNewFriendAndQuestion = () => {
    if (!currentQuizUserCombo) {
      const newCombo = selectNextQuizUserCombo()
      if (newCombo) {
        setCurrentQuizUserCombo(newCombo)
        const newQuestionId = selectQuestion(newCombo.selfId, null)
        return { newFriendId: newCombo.selfId, newQuestionId }
      }
    }

    if (currentQuizUserCombo) {
      const newQuestionId = selectQuestion(
        currentQuizUserCombo.selfId,
        cardState.currentQuestionId
      )
      if (newQuestionId) {
        return {
          newFriendId: currentQuizUserCombo.selfId,
          newQuestionId,
        }
      } else {
        // Current quiz is completed, move to the next one
        const newCombo = selectNextQuizUserCombo()
        if (newCombo) {
          setCurrentQuizUserCombo(newCombo)
          const newQuestionId = selectQuestion(newCombo.selfId, null)
          return { newFriendId: newCombo.selfId, newQuestionId }
        }
      }
    }

    // If no incomplete quizzes, fall back to random selection
    const newFriendId = selectRandomFriend()
    if (newFriendId !== null) {
      const newQuestionId = selectQuestion(
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
        allUsers,
        friendAnswers,
        selfAnswers,
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

  return (
    <View style={styles.container}>
      {/* <ExplanationText /> */}
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
