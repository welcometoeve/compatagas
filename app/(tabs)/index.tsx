import React, { useEffect, useState, useRef } from "react"
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
import CompletionScreen from "@/components/stack/CompletionPopup"
import selectNextQuestion, {
  SelectedQuestion,
} from "@/components/stack/selectNextQuestion"

const { width } = Dimensions.get("window")

interface CardState {
  currentQuestion: SelectedQuestion | null
  nextQuestion: SelectedQuestion | null
}

export default function App() {
  const { friendAnswers, addFriendAnswer, isLoading } = useFriendAnswers()
  const [cardState, setCardState] = useState<CardState>({
    currentQuestion: null,
    nextQuestion: null,
  })
  const [addError, setAddError] = useState<string | undefined>()
  const { user, friends: friends } = useUser()
  const { addNotification, notifications } = useNotification()
  const { selfAnswers } = useSelfAnswers()
  const [completedQuizFriendId, setCompletedQuizFriendId] = useState<
    number | undefined
  >(undefined)
  const [completedQuizId, setCompletedQuizId] = useState<number | undefined>()
  const [completionAnimation] = useState(new Animated.Value(1))
  const slideAnimation = useRef(new Animated.Value(0)).current

  const questionUserCombos: { questionId: number; selfId: number }[] =
    questions.flatMap((q) => {
      const questionsPerUser = friends
        .map((u) => {
          return { questionId: q.id, selfId: u.id }
        })
        .filter((q) => q.selfId !== user?.id)

      return questionsPerUser
    })
  const userFriendAnswers = friendAnswers.filter(
    (fa) => fa.friendId === user?.id
  )
  const availableQuestions: SelectedQuestion[] = questionUserCombos
    .map((qu) => {
      const answered = userFriendAnswers.some(
        (fa) =>
          fa.questionId === qu.questionId &&
          fa.selfId === qu.selfId &&
          fa.friendId === user?.id
      )
      return { questionId: qu.questionId, selfId: qu.selfId, answered }
    })
    .map((qu) => {
      const answeredBySelf = selfAnswers.some(
        (sa) => sa.questionId === qu.questionId && sa.userId === qu.selfId
      )
      return {
        questionId: qu.questionId,
        selfId: qu.selfId,
        answered: qu.answered,
        answeredBySelf,
        quizId: questions.find((q) => q.id === qu.questionId)?.quizId || 0,
      }
    })

  const nextQuestionRef = useRef<SelectedQuestion>(
    cardState.currentQuestion || availableQuestions[0]
  )
  const questionsRef = useRef<SelectedQuestion[]>(availableQuestions)

  const selectNewQuestion = () => {
    const newQuestion = selectNextQuestion(
      nextQuestionRef,
      questionsRef,
      false, // devMode
      false, // sameQuizOnly
      false, // answeredByOthersOnly
      [] // quizIdOrder
    )

    // Update the refs after selecting a new question
    if (newQuestion) {
      nextQuestionRef.current = newQuestion
      questionsRef.current = questionsRef.current.filter(
        (q) =>
          q.questionId !== newQuestion.questionId ||
          q.selfId !== newQuestion.selfId
      )
    }

    return newQuestion
  }

  useEffect(() => {
    if (!cardState.currentQuestion) {
      const initialQuestion = selectNewQuestion()
      setCardState({
        currentQuestion: initialQuestion,
        nextQuestion: selectNewQuestion(),
      })
    }
  }, [])

  // New effect to update questionsRef when selfAnswers changes
  useEffect(() => {
    questionsRef.current = questionsRef.current.map((q) => ({
      ...q,
      answeredBySelf: selfAnswers.some(
        (sa) => sa.questionId === q.questionId && sa.userId === q.selfId
      ),
    }))
  }, [selfAnswers])

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

  const animateCardAway = (newState?: {
    newFriendId: number
    newQuestionId: number
  }) => {
    Animated.timing(slideAnimation, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnimation.setValue(0)
      if (newState) {
        setCardState((prevState) => ({
          currentQuestion: prevState.nextQuestion,
          nextQuestion: {
            questionId: newState.newQuestionId,
            selfId: newState.newFriendId,
            answered: false,
            answeredBySelf: false,
            quizId:
              questions.find((q) => q.id === newState.newQuestionId)?.quizId ||
              0,
          },
        }))
      }
    })
  }

  const handleAnswer = async (optionIndex: number) => {
    if (!cardState.currentQuestion) return

    const { questionId, quizId } = cardState.currentQuestion

    try {
      addFriendAnswer(user?.id || 0, questionId, optionIndex)
      const result = addFriendAnswerInitiatedNotification(
        friends,
        friendAnswers,
        selfAnswers,
        quizId,
        user?.id || 0,
        user?.id || 0,
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

      const newQuestion = selectNewQuestion()

      // Animate the card away and update the state
      animateCardAway(
        newQuestion
          ? {
              newFriendId: newQuestion.selfId,
              newQuestionId: newQuestion.questionId,
            }
          : undefined
      )

      // Update the currentQuestionRef after setting the new state
      if (cardState.nextQuestion) {
        nextQuestionRef.current = cardState.nextQuestion
      }
    } catch (error) {
      setAddError(JSON.stringify(error))
      console.error("Failed to add answer:", error)
    }
  }

  const handleContinue = () => {
    setCompletedQuizFriendId(undefined)
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
    const quiz = quizzes.find((q) => q.id === selectedQuestion.quizId)
    const selfUser = friends.find((u) => u.id === selectedQuestion.selfId)

    return (
      <CardContents
        selfUser={selfUser}
        question={question}
        isLoading={isLoading}
        handleAnswer={handleAnswer}
      />
    )
  }

  const completedQuiz = quizzes.find((q) => q.id === completedQuizId)

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

      {completedQuiz && completedQuizFriendId && (
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
    backgroundColor: "rgb(245, 245, 245)",
  },
})
