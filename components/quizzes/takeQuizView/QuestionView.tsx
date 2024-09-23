import React from "react"
import { Question, Side } from "@/constants/questions/types"
import { TouchableOpacity, View, Text } from "react-native"
import { useUser } from "@/contexts/UserContext"
import { useFriends } from "@/contexts/FriendsContext"
import { insertName } from "@/constants/questions/questions"

export type Answers = {
  [key: number]: { secondPersonLabel: string; side: Side }
}

type QuestionViewProps = {
  question: Question
  answers: Answers
  lockedAnswers: Set<number>
  handleOptionSelect: (
    questionId: number,
    option: { secondPersonLabel: string; side: Side }
  ) => void
  index: number
  selfId: number
}

export default function QuestionView({
  question,
  answers,
  lockedAnswers,
  handleOptionSelect,
  index,
  selfId,
}: QuestionViewProps) {
  const { allUsers } = useFriends()
  const { user } = useUser()
  const isForYou = selfId === user?.id
  const personName = allUsers.find((u) => u.id === selfId)?.name || "Friend"
  return (
    <View
      key={question.id}
      style={{ marginBottom: 24 }}
      testID={`question-${index}`}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 8,
          color: "#000000",
        }}
      >
        {isForYou
          ? question.label.secondPerson
          : insertName(question.label.thirdPerson, personName)}
      </Text>
      <View>
        {question.options.map((option, optionIndex) => {
          const isSelected =
            answers[question.id]?.secondPersonLabel ===
              option.label.secondPerson &&
            answers[question.id]?.side === option.side
          const isLocked = lockedAnswers.has(question.id)

          return (
            <TouchableOpacity
              key={`${question.id}-${optionIndex}`}
              onPress={() =>
                handleOptionSelect(question.id, {
                  secondPersonLabel: option.label.secondPerson,
                  side: option.side,
                })
              }
              disabled={isLocked}
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: isSelected
                  ? isLocked
                    ? "#75B7FF"
                    : "#3A93F4"
                  : "#F0F0F0",
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: isLocked
                  ? isSelected
                    ? "#007AFF"
                    : "#D0D0D0"
                  : "transparent",
              }}
              testID={`option-${question.id}-${optionIndex}`}
            >
              <Text
                style={{ color: isSelected && !isLocked ? "white" : "black" }}
              >
                {`${option.emoji} ${
                  isForYou
                    ? option.label.secondPerson
                    : insertName(
                        option.label.thirdPerson,
                        allUsers.find((u) => u.id === selfId)?.name || "Unknown"
                      )
                }`}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
