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
  quizType: "your" | "their"
  index: number
}

export const GREEN = "#5AF675"
export const RED = "#FF6B6B"

const QuestionResultView: React.FC<QuestionResultViewProps> = ({
  question,
  selfAnswer,
  friendAnswers,
  quizType,
  index,
}) => {
  const { allUsers } = useFriends()
  const { user } = useUser()

  return (
    <View style={styles.container} key={index}>
      <Text style={styles.questionText}>
        {quizType === "your"
          ? question.label.secondPerson
          : insertName(
              question.label.thirdPerson,
              allUsers.find((u) => u.id === selfAnswer.userId)?.name ||
                "Unknown"
            )}
      </Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, optionIndex) => {
          const numFriendsWhoSelected = friendAnswers.filter(
            (fa) => fa.optionIndex === optionIndex
          ).length

          const selfSelected =
            selfAnswer && selfAnswer.optionIndex === optionIndex

          const friendWhoIsYouSelected = friendAnswers.some(
            (fa) => fa.friendId === user?.id && fa.optionIndex === optionIndex
          )

          let userText = ""
          if (quizType === "your") {
            if (quizType === "your" && selfSelected) {
              userText = "You"
            }

            if (numFriendsWhoSelected > 0) {
              if (quizType === "your" && selfSelected) {
                userText += ` +${numFriendsWhoSelected}`
              } else {
                userText += `${numFriendsWhoSelected}`
              }
            }
          } else {
            const selfName = allUsers.find((u) => u.id === selfAnswer.userId)
            if (selfSelected && friendWhoIsYouSelected) {
              userText = `${selfName?.name}, You`
            } else if (friendWhoIsYouSelected) {
              userText = "You "
            }
            if (numFriendsWhoSelected > 0) {
              if (friendWhoIsYouSelected && numFriendsWhoSelected - 1 > 0) {
                userText += ` +${numFriendsWhoSelected - 1}`
              } else if (!friendWhoIsYouSelected) {
                userText += `${numFriendsWhoSelected}`
              }
            }
          }

          const friendWhoIsYouSelectedCorrect = friendAnswers.some(
            (fa) =>
              fa.friendId === user?.id &&
              fa.optionIndex === optionIndex &&
              optionIndex === selfAnswer.optionIndex
          )

          return (
            <TouchableOpacity
              key={`${question.id}-${optionIndex}`}
              disabled={true}
              style={[
                styles.optionButton,
                {
                  backgroundColor:
                    selfSelected && quizType === "your"
                      ? GREEN
                      : friendWhoIsYouSelectedCorrect
                      ? GREEN
                      : friendWhoIsYouSelected
                      ? RED
                      : numFriendsWhoSelected > 0
                      ? "rgb(200, 200, 200)"
                      : "#F0F0F0",
                },
              ]}
            >
              <Text style={[styles.optionText]}>
                {quizType === "your"
                  ? option.label.secondPerson
                  : insertName(
                      option.label.thirdPerson,
                      allUsers.find((u) => u.id === selfAnswer.userId)?.name ||
                        "Unknown"
                    )}
              </Text>
              <View style={styles.usersContainer}>
                <Text style={[styles.usersText]}>{userText}</Text>
              </View>
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
    padding: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    marginHorizontal: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 20,
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
    width: "100%",
    // borderWidth: 1,
    // borderColor: "#E0E0E0",
  },
  selectedOption: {
    backgroundColor: GREEN,
    // borderColor: "#75B7FF",
    // borderWidth: 2,
  },
  selectedByFriendOption: {
    // borderColor: "#007AFF",
    // borderWidth: 2,
    backgroundColor: RED,
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
    color: "black",
    textAlign: "right",
    width: "90%",
  },
  selectedOptionText: {
    color: "#333333",
  },
})

export default QuestionResultView
