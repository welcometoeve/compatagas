import React, { useEffect, useState, useRef, useMemo } from "react"
import { View, StyleSheet, Animated, Dimensions } from "react-native"
import { questions, quizzes } from "../../constants/questions/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useNotification } from "@/contexts/notification/NotificationContext"
import { addFriendAnswerInitiatedNotification } from "@/contexts/notification/addNotification"
import * as Haptics from "expo-haptics"
import {
  CardContents,
  CardStack,
  ExplanationText,
  OutOfQuestionsView,
} from "@/components/stack/StackComponents"
import { useEnvironment } from "@/contexts/EnvironmentContext"
import { useFriends } from "@/contexts/FriendsContext"
import { Quiz } from "@/constants/questions/types"
import { SelectedQuestion } from "@/components/stack/selectNextQuestion"

const { width } = Dimensions.get("window")

interface CardState {
  currentQuestion: SelectedQuestion | null
  nextQuestion: SelectedQuestion | null
}

// Add this boolean to control showing dummy info in the completion screen
const SHOW_DUMMY_COMPLETION = false

export default function App() {
  const { friendAnswers, addFriendAnswer, isLoading } = useFriendAnswers()
  const [cardState, setCardState] = useState<CardState>({
    currentQuestion: null,
    nextQuestion: null,
  })
  const [addError, setAddError] = useState<string | undefined>()
  const { user, addLemon } = useUser()
  const { allUsers, getFriends } = useFriends()

  const friends = useMemo(
    () => (user ? getFriends(user?.id) : []),
    [user, allUsers]
  )

  const { addNotification, notifications } = useNotification()
  const { selfAnswers } = useSelfAnswers()
  // const [completedQuizFriendId, setCompletedQuizFriendId] = useState<
  //   number | undefined
  // >(undefined)
  const [completedQuizId, setCompletedQuizId] = useState<number | undefined>()
  const [completionAnimation] = useState(new Animated.Value(1))
  const slideAnimation = useRef(new Animated.Value(0)).current
  const { isDev } = useEnvironment()
  const questionsRef = useRef<SelectedQuestion[]>([])
  const nextQuestionRef = useRef<SelectedQuestion | null>(null)

  useEffect(() => {
    const availableQuestions = selfAnswers
      .map((sa) => {
        return {
          questionId: sa.questionId,
          selfId: sa.userId,
          quizId: sa.quizId,
          answered:
            friendAnswers.find(
              (fa) =>
                fa.friendId === user?.id && fa.questionId === sa.questionId
            ) !== undefined ||
            questionsRef.current.some(
              (q) =>
                q.selfId === sa.userId &&
                q.questionId === sa.questionId &&
                q.answered
            ),
        }
      })
      .filter((q) => q.selfId !== user?.id)

    questionsRef.current = availableQuestions

    if (nextQuestionRef.current === null) {
      const newQuestion = selectNewQuestion()
      const anotherNewQuestion = selectNewQuestion()
      setCardState((prevState) => ({
        currentQuestion: newQuestion,
        nextQuestion: anotherNewQuestion,
      }))
    }
  }, [friendAnswers, selfAnswers, user, friends])

  const selectNewQuestion = () => {
    if (questionsRef.current.filter((q) => !q.answered).length === 0) {
      nextQuestionRef.current = null
      return null
    }

    const newQuestion = questionsRef.current.filter((q) => !q.answered)[0]

    // Update the refs after selecting a new question
    if (newQuestion) {
      nextQuestionRef.current = newQuestion
      questionsRef.current = questionsRef.current.map((q) => {
        return q.questionId === newQuestion.questionId &&
          q.selfId == newQuestion.selfId
          ? { ...q, answered: true }
          : q
      })
    }

    return newQuestion
  }

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

  // useEffect(() => {
  //   if (completedQuizFriendId !== undefined) {
  //     startCompletionAnimation()
  //   }
  // }, [completedQuizFriendId])

  const animateCardAway = (q?: SelectedQuestion) => {
    Animated.timing(slideAnimation, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnimation.setValue(0)
      setCardState((prevState) => ({
        currentQuestion: prevState.nextQuestion ?? null,
        nextQuestion: q ?? null,
      }))
    })
  }

  const handleNext = () => {
    const newQuestion = selectNewQuestion()

    // Animate the card away and update the state
    animateCardAway(newQuestion ?? undefined)

    // Update the currentQuestionRef after setting the new state
    if (cardState.nextQuestion) {
      nextQuestionRef.current = cardState.nextQuestion
    }
  }
  const handleAnswer = async (optionIndex?: number) => {
    if (!cardState.currentQuestion) return

    const { questionId, quizId, selfId } = cardState.currentQuestion

    try {
      if (optionIndex !== undefined) {
        addFriendAnswer(selfId, questionId, optionIndex)
        const result = addFriendAnswerInitiatedNotification(
          friends,
          friendAnswers,
          selfAnswers,
          quizId,
          selfId,
          user?.id || 0,
          notifications,
          addNotification
        )
        if (result !== undefined) {
          await triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy)
          // setCompletedQuizFriendId(result.friendId)
          // setCompletedQuizId(result.quizId)
          // addLemon()
        } else {
          await triggerHaptic(Haptics.ImpactFeedbackStyle.Light)
        }

        return selfAnswers.find(
          (sa) => sa.questionId === questionId && sa.userId === selfId
        )
      }
    } catch (error) {
      setAddError(JSON.stringify(error))
      console.error("Failed to add answer:", error)
    }
  }

  const handleContinue = () => {
    // setCompletedQuizFriendId(undefined)
    setCompletedQuizId(undefined)
    const newQuestion = selectNewQuestion()
    setCardState((prevState) => ({
      ...prevState,
      nextQuestion: newQuestion,
    }))
  }

  const isOutOfQuestions = !cardState.currentQuestion && !cardState.nextQuestion

  const renderCardContents = (current: boolean) => {
    const selectedQuestion = current
      ? cardState.currentQuestion
      : cardState.nextQuestion
    if (!selectedQuestion) return null

    const question = questions.find((q) => q.id === selectedQuestion.questionId)
    const selfUser = friends.find((u) => u.id === selectedQuestion.selfId)

    return (
      <CardContents
        selfUser={selfUser}
        question={question}
        isLoading={isLoading}
        handleAnswer={handleAnswer}
        onSkip={() => handleAnswer()}
        onNext={handleNext}
      />
    )
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
            // {
            //   opacity: completedQuizFriendId !== undefined ? 0.5 : 1,
            // },
          ]}
        >
          <CardStack
            renderCardContents={renderCardContents}
            slideAnimation={slideAnimation}
          />
        </View>
      )}

      {/* {(completedQuiz || SHOW_DUMMY_COMPLETION) &&
        (completedQuizFriendId || SHOW_DUMMY_COMPLETION) && (
          <CompletionScreen
            completionAnimation={completionAnimation}
            completedQuiz={
              SHOW_DUMMY_COMPLETION ? dummyQuiz : (completedQuiz as Quiz)
            }
            completedQuizSelfId={
              SHOW_DUMMY_COMPLETION ? 1 : completedQuizFriendId!
            }
            onDismiss={() => setCompletedQuizFriendId(undefined)}
            onContinue={handleContinue}
          />
        )} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(245, 245, 245)",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "rgb(245, 245, 245)",
  },
})

const dummyQuiz: Quiz = {
  id: 5,
  name: "Style Pack",
  subtitle: {
    secondPerson: "How stylish are you?",
    thirdPerson: "How stylish is {name}?",
  },
  src: require("../../assets/images/stylePack.jpg"),
  leftLabel: "Style Novice",
  rightLabel: "Fashion Forward",
  resultLabels: [
    { label: "Comfort Seeker", emoji: "🛋️" },
    { label: "Practical Dresser", emoji: "👕" },
    { label: "Casual Chic", emoji: "😎" },
    { label: "Style Enthusiast", emoji: "🎨" },
    { label: "Fashion Savvy", emoji: "✨" },
  ],
}
