import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import { Question } from "@/constants/questions/types"
import { SelfAnswer } from "@/contexts/SelfAnswerContext"
import { FriendAnswer } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { insertName } from "@/constants/questions/questions"
import { useFriends } from "@/contexts/FriendsContext"

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
  const { user } = useUser()
  const { friends } = useFriends()

  const getUsersForOption = (optionIndex: number) => {
    const names: string[] = []

    if (selfAnswer && selfAnswer.optionIndex === optionIndex) {
      names.push(
        selfAnswer.userId === user?.id
          ? "You"
          : friends.find((user) => user.id === selfAnswer.userId)?.name ||
              "Unknown"
      )
    }

    const friendsWhoSelected = (friendAnswers ?? [])
      .filter((answer) => answer.optionIndex === optionIndex)
      .map((answer) =>
        answer.friendId === user?.id
          ? "You"
          : friends.find((user) => user.id === answer.friendId)?.name ||
            "Unknown"
      )

    names.push(...friendsWhoSelected)
    return names.join(", ")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>
        {quizType === "your"
          ? question.label.secondPerson
          : insertName(
              question.label.thirdPerson,
              friends.find((u) => u.id === selfAnswer.userId)?.name || "Unknown"
            )}
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
                {quizType === "your"
                  ? option.label.secondPerson
                  : insertName(
                      option.label.thirdPerson,
                      friends.find((u) => u.id === selfAnswer.userId)?.name ||
                        "Unknown"
                    )}
              </Text>
              {usersWhoSelected && (
                <View style={styles.usersContainer}>
                  <Text
                    style={[
                      styles.usersText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {usersWhoSelected}
                  </Text>
                </View>
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
  usersContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  usersText: {
    color: "#666666",
    textAlign: "right",
    width: "90%",
  },
  selectedOptionText: {
    color: "#333333",
  },
})

export default QuestionResultView
