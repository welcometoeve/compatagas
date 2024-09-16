import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Question, Side } from "@/components/questions"
import { SelfAnswer } from "@/contexts/SelfAnswerContext"
import { FriendAnswer } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"

type QuestionViewProps = {
  question: Question
  selfAnswer: SelfAnswer
  friendAnswers: FriendAnswer[]
  lockedAnswers: Set<number>
  handleOptionSelect: (questionId: number, optionIndex: number) => void
  index: number
  quizType: "your" | "their"
}

const QuestionView: React.FC<QuestionViewProps> = ({
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
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: isSelected ? "#FF4457" : "#262C34",
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: !isLocked
                  ? "transparent"
                  : isSelected
                  ? "#FF4457"
                  : "#3C444F",
              }}
            >
              <Text style={{ color: "#FFFFFF", flex: 1 }}>{option.label}</Text>
              {usersWhoSelected && (
                <Text
                  style={{
                    color: "#FFFFFF",
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
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: "column",
  },
})

export default QuestionView
