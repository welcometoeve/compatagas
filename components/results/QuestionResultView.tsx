import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Question, Side } from "@/components/questions"
import { SelfAnswer } from "@/contexts/SelfAnswerContext"
import { FriendAnswer } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"

type QuestionViewProps = {
  question: Question
  selfAnswer: SelfAnswer | undefined
  friendAnswers: FriendAnswer[]
  lockedAnswers: Set<number>
  handleOptionSelect: (questionId: number, optionIndex: number) => void
  index: number
}

const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  selfAnswer,
  friendAnswers,
  lockedAnswers,
}) => {
  const isLocked = lockedAnswers.has(question.id)
  const { allUsers, user } = useUser()

  const getUsersForOption = (optionIndex: number) => {
    const names: string[] = []

    if (selfAnswer && selfAnswer.optionIndex === optionIndex) {
      names.push(
        selfAnswer.userId === user?.id
          ? "You"
          : allUsers.find((user) => user.id === selfAnswer.userId)?.name ||
              "Unknown"
      )
    }

    const friendsWhoSelected = (friendAnswers ?? [])
      .filter((answer) => answer.optionIndex === optionIndex)
      .map((answer) =>
        answer.friendId === user?.id
          ? "You"
          : allUsers.find((user) => user.id === answer.friendId)?.name ||
            "Unknown"
      )

    names.push(...friendsWhoSelected)

    return names.join(", ")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.label}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, optionIndex) => {
          const isSelected =
            selfAnswer && selfAnswer.optionIndex === optionIndex

          const isSelectedByFriend = friendAnswers.some(
            (answer) => answer.optionIndex === optionIndex
          )

          const usersWhoSelected = getUsersForOption(optionIndex)

          return (
            <TouchableOpacity
              key={`${question.id}-${optionIndex}`}
              disabled={isLocked}
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: isSelected ? "#8b5cf6" : "rgb(40, 40, 40)",
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: isSelectedByFriend
                  ? "white"
                  : isSelected
                  ? "#8b5cf6"
                  : "rgb(80, 80, 80)",
              }}
            >
              <Text style={{ color: "white", flex: 1 }}>{option.label}</Text>
              {usersWhoSelected && (
                <Text
                  style={{
                    color: "white",
                    marginLeft: 8,
                    textAlign: "right",
                    flex: 1,
                  }}
                >
                  {usersWhoSelected}
                </Text>
              )}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "column",
  },
})

export default QuestionView
