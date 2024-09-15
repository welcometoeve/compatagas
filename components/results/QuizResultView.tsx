import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { ChevronLeft } from "lucide-react-native"
import { Question, Quiz, Side } from "@/components/questions"
import { useUser } from "@/contexts/UserContext"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import ResultSlider from "./ResultResultSlider"
import QuestionResultView from "./QuestionResultView"
import collect from "../collect"

type QuizResultsViewProps = {
  quiz: Quiz
  questions: Question[]
  goBack: () => void
  friendIds: number[]
  quizType: "your" | "their"
  selfId: number
}

type Result = {
  id: number
  name: string
  value: number
  isSelf: boolean
}

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  quiz,
  questions,
  goBack,
  friendIds,
  quizType,
  selfId,
}) => {
  const [results, setResults] = useState<Result[]>([])

  const { user, allUsers } = useUser()
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()

  useEffect(() => {
    if (user && selfAnswers && friendAnswers) {
      const allResults: Result[] = []

      const selfResult = calculateQuizResult(
        selfAnswers.filter(
          (sa) => sa.userId === selfId && sa.quizId === quiz.id
        )
      )

      allResults.push({
        id: selfId,
        name:
          user.id === selfId
            ? "You"
            : allUsers.find((u) => u.id === selfId)?.name || "Friend",
        value: selfResult,
        isSelf: true,
      })

      friendIds.forEach((friendId) => {
        const friendResult = calculateQuizResult(
          friendAnswers.filter(
            (fa) => fa.friendId === friendId && fa.quizId === quiz.id
          )
        )
        const friendName =
          allUsers.find((u) => u.id === friendId)?.name || "Friend"
        allResults.push({
          id: friendId,
          name: user.id === friendId ? "You" : friendName,
          value: friendResult,
          isSelf: false,
        })
      })

      setResults(allResults)
    }
  }, [
    user,
    selfAnswers,
    friendAnswers,
    questions,
    quiz.id,
    friendIds,
    allUsers,
  ])

  const calculateQuizResult = (answers: (SelfAnswer | FriendAnswer)[]) => {
    let totalScore = 0
    questions.forEach((question) => {
      const answer = answers.find((a) => a.questionId === question.id)
      if (answer) {
        const optionIndex = answer.optionIndex
        const side = question.options[optionIndex].side
        const score = side === Side.LEFT ? -1 : 1
        totalScore += score
      }
    })
    const averageScore = totalScore / questions.length
    return averageScore
  }

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    // This function is now a no-op since answers are locked in the results view
    console.log("Option selected:", questionId, optionIndex)
  }

  const quizSelfAnswers =
    quizType == "your"
      ? selfAnswers.filter(
          (sa) => sa.userId === selfId && sa.quizId === quiz.id
        )
      : selfAnswers.filter(
          (sa) => sa.quizId === quiz.id && friendIds.includes(sa.userId)
        )
  const userName =
    selfId === user?.id
      ? "Your"
      : `${allUsers.find((u) => u.id === selfId)?.name}'s` || "Friend"

  const quizFriendAnswers = collect(
    friendAnswers.filter((fa) => fa.selfId === selfId && fa.quizId === quiz.id),
    ["questionId"]
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ChevronLeft size={32} color="white" />
        </TouchableOpacity>

        <View style={styles.quizHeader}>
          <Image
            source={quiz.src}
            style={styles.quizImage}
            resizeMode="cover"
          />
          <Text
            style={styles.quizTitle}
          >{`${userName} ${quiz.name} Results`}</Text>
        </View>

        <ResultSlider quiz={quiz} results={results} />
        <View style={styles.spacer}></View>
        {questions.map((question) => (
          <QuestionResultView
            quizType={quizType}
            key={question.id}
            question={question}
            selfAnswer={
              quizSelfAnswers.find((sa) => sa.questionId === question.id)!
            }
            friendAnswers={
              quizFriendAnswers.find((q) => q[0]?.questionId === question.id) ||
              []
            }
            lockedAnswers={new Set(questions.map((q) => q.id))}
            handleOptionSelect={handleOptionSelect}
            index={question.id}
          />
        ))}

        <TouchableOpacity onPress={goBack} style={styles.backToQuizzesButton}>
          <ChevronLeft size={20} color="white" style={styles.backButtonIcon} />
          <Text style={styles.backButtonText}>Back to Quizzes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 0,
  },
  backButton: {
    position: "absolute",
    top: 24,
    left: 24,
    zIndex: 1,
  },
  quizHeader: {
    marginBottom: 24,
    alignItems: "center",
  },
  quizImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  spacer: {
    height: 50,
  },
  backToQuizzesButton: {
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: "rgb(40, 40, 40)",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default QuizResultsView
