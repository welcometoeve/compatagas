import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Question } from "@/components/questions"
import { SelfAnswer } from "@/contexts/SelfAnswerContext"
import { FriendAnswer } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"

type QuestionResultViewProps = {
  question: Question
  selfAnswer: SelfAnswer
  friendAnswers: FriendAnswer[]
  lockedAnswers: Set<number>
  quizType: "your" | "their"
}

const QuestionResultView: React.FC<QuestionResultViewProps> = ({
  question,
  selfAnswer,
  friendAnswers,
  lockedAnswers,
  quizType,
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
      <Text style={styles.questionText}>
        {quizType === "your"
          ? question.secondPersonLabel
          : question.thirdPersonLabel}
      </Text>
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
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                isSelectedByFriend && styles.selectedByFriendOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
              {usersWhoSelected && (
                <Text
                  style={[
                    styles.usersText,
                    isSelected && styles.selectedOptionText,
                  ]}
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
    backgroundColor: "#FFFFFF",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "column",
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  selectedOption: {
    backgroundColor: "#75B7FF",
    borderColor: "#75B7FF",
    borderWidth: 2,
  },
  selectedByFriendOption: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  optionText: {
    color: "#333333",
    flex: 1,
  },
  usersText: {
    color: "#666666",
    marginLeft: 8,
    textAlign: "right",
    flex: 1,
  },
  selectedOptionText: {
    color: "#333333",
  },
})

export default QuestionResultView
