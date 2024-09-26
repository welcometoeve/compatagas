import { Question, Side } from "@/constants/questions/types"
import { TouchableOpacity, View, Text } from "react-native"
import { useUser } from "@/contexts/UserContext"
import { useFriends } from "@/contexts/FriendsContext"
import { insertName } from "@/constants/questions/questions"
import React from "react"

type QuestionViewProps = {
  question: Question
  answer?: { questionId: number; optionIndex: number }
  setAnswer: (answer: { questionId: number; optionIndex: number }) => void
  index: number
  selfId: number
  isDone: boolean
}

export default function QuestionView({
  question,
  answer,
  index,
  selfId,
  isDone,
  setAnswer,
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
          return (
            <TouchableOpacity
              key={`${question.id}-${optionIndex}`}
              onPress={() =>
                setAnswer({ questionId: question.id, optionIndex })
              }
              disabled={isDone}
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor:
                  isDone && optionIndex === answer?.optionIndex
                    ? "#75B7FF"
                    : optionIndex === answer?.optionIndex
                    ? "#3A93F4"
                    : "#F0F0F0",
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: isDone
                  ? optionIndex === answer?.optionIndex
                    ? "#007AFF"
                    : "#D0D0D0"
                  : "transparent",
              }}
              testID={`option-${question.id}-${optionIndex}`}
            >
              <Text
                style={{
                  color:
                    optionIndex === answer?.optionIndex && !isDone
                      ? "white"
                      : "black",
                }}
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
