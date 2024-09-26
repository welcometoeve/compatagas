import { useFriends } from "@/contexts/FriendsContext"
import QuestionResultView from "../results/QuestionResultView"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import collect from "../collect"
import { Question } from "@/constants/questions/types"
import { questions } from "@/constants/questions/questions"
import { useUser } from "@/contexts/UserContext"
import { View, StyleSheet, Text } from "react-native"
import React from "react"

export function useQuestionResults(userId: number) {
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const relevantSelfAnswers = selfAnswers.filter((sa) => sa.userId === userId)
  const { getFriends } = useFriends()
  const friends = getFriends(userId)

  const faGroups = collect(
    friendAnswers.filter((fa) => friends.some((f) => f.id === fa.friendId)),
    ["questionId", "selfId"]
  )

  const groups: {
    selfAnswer: SelfAnswer
    friendAnswers: FriendAnswer[]
    question: Question | undefined
  }[] = relevantSelfAnswers.map((sa) => {
    const friendAnswers = faGroups.find(
      (group) =>
        group.length > 0 &&
        group[0].questionId === sa.questionId &&
        group[0].selfId === sa.userId
    )

    const question = questions.find((q) => q.id === sa.quizId)
    return { selfAnswer: sa, friendAnswers: friendAnswers ?? [], question }
  })

  const usableGroups = groups.filter(
    (g) => g.friendAnswers.length > 0 && !!g.question
  )
  return usableGroups
}

export default function QuestionsList({ userId }: { userId: number }) {
  const usableGroups = useQuestionResults(userId)
  const { user } = useUser()

  const isYou = userId === user?.id

  return usableGroups.length === 0 ? (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsText}>Results list is empty</Text>
    </View>
  ) : (
    usableGroups.map((g, i) => (
      <QuestionResultView
        selfAnswer={g.selfAnswer}
        friendAnswers={g.friendAnswers}
        quizType={isYou ? "your" : "their"}
        question={g.question!}
        index={i}
        key={i}
      />
    ))
  )
}

const styles = StyleSheet.create({
  resultsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsText: {
    fontSize: 18,
    color: "gray",
  },
})
