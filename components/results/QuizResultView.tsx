import React, { useEffect, useMemo, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native"
import { ChevronLeft } from "lucide-react-native"

import { Question, Quiz, Side } from "@/constants/questions/types"
import { useUser } from "@/contexts/UserContext"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import QuestionResultView from "./QuestionResultView"
import collect from "../collect"
import QuizResultsWithFriendsView from "./QuizResultsWithFriendsView"
import { insertName, questions, quizzes } from "@/constants/questions/questions"
import { useFriends } from "@/contexts/FriendsContext"
import { usePage } from "@/contexts/PageContext"

type QuizResultsViewProps = {
  quizId: number
  friendIds: number[]
  selfId: number
}

type Result = {
  id: number
  name: string
  value: number
  isSelf: boolean
  correctPercentage?: number
}

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  quizId,
  friendIds,
  selfId,
}) => {
  const { user } = useUser()
  const { allUsers } = useFriends()
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const { popPage } = usePage()
  const [results, setResults] = useState<Result[]>([])

  const quiz = quizzes.find((q) => q.id === quizId)

  useEffect(() => {
    if (user && selfAnswers && friendAnswers && quiz) {
      const allResults: Result[] = []

      const selfResult = calculateQuizResult(
        selfAnswers.filter((sa) => sa.userId === selfId && sa.quizId === quizId)
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
            (fa) => fa.friendId === friendId && fa.quizId === quizId
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
  }, []) // don't worry about it

  const quizQuestions = questions.filter((q) => q.quizId === quizId)
  const calculateQuizResult = (answers: (SelfAnswer | FriendAnswer)[]) => {
    let totalScore = 0
    quizQuestions.forEach((question) => {
      const answer = answers.find((a) => a.questionId === question.id)
      if (answer) {
        const optionIndex = answer.optionIndex
        const side = question.options[optionIndex].side
        const score = side === "neither" ? 0 : side === "left" ? -1 : 1
        totalScore += score
      }
    })
    const averageScore = totalScore / quizQuestions.length
    return averageScore
  }

  const correctnessScores = useMemo(() => {
    const relevantSelfAnswers = selfAnswers.filter(
      (sa) => sa.quizId === quizId && sa.userId === selfId
    )
    const relevantFriendAnswers = collect(
      friendAnswers.filter(
        (fa) => fa.quizId === quizId && fa.selfId === selfId
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
  }, [selfAnswers, friendAnswers, quizId, selfId])

  const resultsWithCorrectness = results.map((result) => {
    const correctnessScore = correctnessScores.find(
      (score) => score.friendId === result.id
    )
    return {
      ...result,
      correctPercentage: correctnessScore
        ? correctnessScore.score * 100
        : undefined,
    }
  })

  const quizSelfAnswers = selfAnswers.filter(
    (sa) => sa.userId === selfId && sa.quizId === quiz?.id
  )

  const userName =
    selfId === user?.id
      ? "Your"
      : `${allUsers.find((u) => u.id === selfId)?.name}'s` || "Friend"

  const quizFriendAnswers = collect(
    friendAnswers.filter((fa) => fa.selfId === selfId && fa.quizId === quizId),
    ["questionId"]
  )

  if (!quiz) {
    return <Text>Quiz not found</Text>
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity onPress={popPage} style={styles.backButton}>
          <ChevronLeft size={32} color="#000000" />
        </TouchableOpacity>

        <View style={styles.quizHeader}>
          <View style={styles.imageContainer}>
            <Image
              source={quiz.src as ImageSourcePropType}
              style={styles.quizImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.quizTitle}>{`${userName} ${quiz.name}`}</Text>
          <Text style={styles.quizSubtitle}>
            {selfId === user?.id
              ? quiz.subtitle.secondPerson
              : insertName(
                  quiz.subtitle.thirdPerson,
                  allUsers.find((u) => u.id === selfId)?.name ?? ""
                )}
          </Text>
        </View>
        {selfId === user?.id ? (
          <View
            style={{
              marginBottom: 10,
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          ></View>
        ) : (
          <View style={{ marginBottom: 35 }} />
        )}

        <QuizResultsWithFriendsView
          quiz={quiz}
          results={resultsWithCorrectness}
          quizResult={resultsWithCorrectness.find((r) => r.isSelf)?.value || 0}
          quizType={selfId === user?.id ? "your" : "their"}
        />
        <View style={{ marginBottom: 20 }} />

        {quizQuestions.map((question) =>
          quizSelfAnswers.find((sa) => sa.questionId === question.id) ? (
            <QuestionResultView
              quizType={selfId === user?.id ? "your" : "their"}
              key={question.id}
              question={question}
              selfAnswer={
                quizSelfAnswers.find((sa) => sa.questionId === question.id)!
              }
              friendAnswers={
                quizFriendAnswers.find(
                  (q) => q[0]?.questionId === question.id
                ) || []
              }
              lockedAnswers={new Set(quizQuestions.map((q) => q.id))}
            />
          ) : null
        )}

        <TouchableOpacity onPress={popPage} style={styles.backToQuizzesButton}>
          <ChevronLeft
            size={20}
            color="#000000"
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
    backgroundColor: "#FFFFFF",
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
    marginBottom: 20,
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  quizImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  quizTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  quizSubtitle: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    marginTop: 8,
  },
  backToQuizzesButton: {
    marginTop: 24,
    backgroundColor: "#E0E0E0",
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
    color: "#000000",
    fontWeight: "bold",
  },
  revealButton: {
    backgroundColor: "#FF4457",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  revealButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  lemonCount: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 28,
    paddingTop: 15,
    width: 250,
  },
})

export default QuizResultsView
