import React, { useEffect, useState, useRef, useMemo } from "react"
import { View, StyleSheet, Animated, Dimensions } from "react-native"
import { questions, quizzes } from "../../constants/questions/questions"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
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
import {
  StackSelfAnswer,
  useStackSelfAnswers,
} from "@/components/stack/useStackSelfAnswers"

const { width } = Dimensions.get("window")

interface CardState {
  currentSelfAnswer: StackSelfAnswer | null
  nextSelfAnswer: StackSelfAnswer | null
}

// Add this boolean to control showing dummy info in the completion screen
const SHOW_DUMMY_COMPLETION = false

export default function App() {
  const [cardState, setCardState] = useState<CardState>({
    currentSelfAnswer: null,
    nextSelfAnswer: null,
  })
  const [addError, setAddError] = useState<string | undefined>()
  const { user } = useUser()
  const { allUsers, getFriends } = useFriends()
  const { addNotification, notifications } = useNotification()
  const { addFriendAnswer } = useFriendAnswers()
  const [completedQuizId, setCompletedQuizId] = useState<number | undefined>()
  const [completionAnimation] = useState(new Animated.Value(1))
  const slideAnimation = useRef(new Animated.Value(0)).current
  const { stackSelfAnswers, stackSelfAnswersLoading, stackSelfAnswersError } =
    useSelfAnswers()

  const [selfAnswers, setSelfAnswers] = useState<StackSelfAnswer[]>([])

  const triggerHaptic = async (style: Haptics.ImpactFeedbackStyle) => {
    try {
      await Haptics.impactAsync(style)
    } catch (error) {
      console.error("Failed to trigger haptic:", error)
    }
  }

  useEffect(() => {
    const currentSelfAnswer = stackSelfAnswers[0]
    const nextSelfAnswer = stackSelfAnswers[1]
    setSelfAnswers(stackSelfAnswers.slice(2))
    setCardState({ currentSelfAnswer, nextSelfAnswer })
  }, [stackSelfAnswers])

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

  const handleNext = () => {
    const sa = selfAnswers[0]
    setSelfAnswers(selfAnswers.slice(1))
    Animated.timing(slideAnimation, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      slideAnimation.setValue(0)
      setCardState((prevState) => ({
        currentSelfAnswer: prevState.nextSelfAnswer ?? null,
        nextSelfAnswer: sa ?? null,
      }))
    })
  }

  const handleAnswer = async (optionIndex?: number) => {
    if (!cardState.currentSelfAnswer) return

    const sa = cardState.currentSelfAnswer

    try {
      if (optionIndex !== undefined) {
        addFriendAnswer(sa.user.id, sa.questionId, optionIndex)
        await triggerHaptic(Haptics.ImpactFeedbackStyle.Light)

        // const result = addFriendAnswerInitiatedNotification(
        //   friends,
        //   friendAnswers,
        //   selfAnswers,
        //   quizId,
        //   selfId,
        //   user?.id || 0,
        //   notifications,
        //   addNotification
        // )
        // if (result !== undefined) {
        //   await triggerHaptic(Haptics.ImpactFeedbackStyle.Heavy)
        //   // setCompletedQuizFriendId(result.friendId)
        //   // setCompletedQuizId(result.quizId)
        //   // addLemon()
        // } else {
        //   await triggerHaptic(Haptics.ImpactFeedbackStyle.Light)
        // }

        return sa
      }
    } catch (error) {
      setAddError(JSON.stringify(error))
      console.error("Failed to add answer:", error)
    }
  }

  // const handleContinue = () => {
  //   // setCompletedQuizFriendId(undefined)
  //   setCompletedQuizId(undefined)
  //   const newQuestion = selectNewQuestion()
  //   setCardState((prevState) => ({
  //     ...prevState,
  //     nextQuestion: newQuestion,
  //   }))
  // }

  // get initial answers

  const isOutOfQuestions =
    !cardState.nextSelfAnswer &&
    !cardState.currentSelfAnswer &&
    !stackSelfAnswersLoading

  const renderCardContents = (current: boolean) => {
    const selectedSelfAnswer = current
      ? cardState.currentSelfAnswer
      : cardState.nextSelfAnswer
    if (!selectedSelfAnswer) return null

    const question = questions.find(
      (q) => q.id === selectedSelfAnswer.questionId
    )

    return (
      !stackSelfAnswersLoading && (
        <CardContents
          selfUser={selectedSelfAnswer.user}
          question={question}
          isLoading={false}
          handleAnswer={handleAnswer}
          onSkip={() => handleAnswer()}
          onNext={handleNext}
        />
      )
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
