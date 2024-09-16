import React, { useEffect, useMemo, useState } from "react"
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
import ResultResultSlider from "./ResultResultSlider"

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
  const { user, allUsers } = useUser()
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()

  const [results, setResults] = useState<Result[]>([])

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

  const correctnessScores = useMemo(() => {
    const relevantSelfAnswers = selfAnswers.filter(
      (sa) => sa.quizId === quiz.id && sa.userId === selfId
    )
    const relevantFriendAnswers = collect(
      friendAnswers.filter(
        (fa) => fa.quizId === quiz.id && fa.selfId === selfId
      ),
      ["friendId"]
    )

    return relevantFriendAnswers.map((g) => {
      const score = g
        .map((fa) => {
          const selfAnswer = relevantSelfAnswers.find(
            (sa) => sa.questionId === fa.questionId
          )
          return selfAnswer?.optionIndex === fa.optionIndex ? 1 : (0 as number)
        })
        .reduce((acc, val) => acc + val, 0)

      return { score: score / g.length, friendId: g[0].friendId }
    })
  }, [selfAnswers, friendAnswers, quiz.id, selfId])

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
          (sa) => sa.quizId === quiz.id && selfId === sa.userId
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
          <ChevronLeft size={32} color="#FFFFFF" />
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

        <ResultResultSlider results={results} quiz={quiz} />

        <View style={styles.friendScores}>
          {correctnessScores.map((score) => {
            const friend = allUsers.find((u) => u.id === score.friendId)
            const title =
              score.friendId === user?.id
                ? "Your Score:"
                : `${friend?.name || "Unknown"}'s Score:`
            return (
              <View key={score.friendId} style={styles.friendScore}>
                <Text style={styles.friendName}>{title}</Text>
                <Text style={styles.friendScoreValue}>{`${(
                  score.score * 100
                ).toFixed(0)}%`}</Text>
              </View>
            )
          })}
        </View>

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
          <ChevronLeft
            size={20}
            color="#FFFFFF"
            style={styles.backButtonIcon}
          />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111419",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 20,
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  friendScores: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 24,
    paddingTop: 32,
  },
  friendScore: {
    alignItems: "center",
    margin: 8,
    backgroundColor: "#1E2530",
    padding: 20,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
  },
  friendName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  friendScoreValue: {
    color: "#FF4457",
    fontSize: 18,
    fontWeight: "bold",
  },
  backToQuizzesButton: {
    marginTop: 24,
    backgroundColor: "#3C444F",
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
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})

export default QuizResultsView
