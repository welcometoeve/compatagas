import React from "react"
import { Question, Side } from "@/components/questions"
import { TouchableOpacity, View, Text } from "react-native"

type Answers = {
  [key: number]: { label: string; side: Side }
}

export default function QuestionView({
  question,
  answers,
  lockedAnswers,
  handleOptionSelect,
  index,
}: {
  question: Question
  answers: Answers
  lockedAnswers: Set<number>
  handleOptionSelect: (questionId: number, option: any) => void
  index: number
}) {
  return (
    <View key={question.id} style={{ marginBottom: 24 }} id={index.toString()}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 8,
          color: "#000000",
        }}
      >
        {question.secondPersonLabel}
      </Text>
      <View>
        {question.options.map((option, optionIndex) => {
          const isSelected =
            answers[question.id]?.label === option.label &&
            answers[question.id]?.side === option.side
          const isLocked = lockedAnswers.has(question.id)

          return (
            <TouchableOpacity
              key={`${question.id}-${optionIndex}`}
              onPress={() => {
                handleOptionSelect(question.id, option)
              }}
              disabled={isLocked}
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor:
                  isSelected && !isLocked
                    ? "#3A93F4"
                    : isSelected
                    ? "#75B7FF"
                    : "#F0F0F0",
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 1,
                borderColor: !isLocked
                  ? "transparent"
                  : isSelected
                  ? "#007AFF"
                  : "#D0D0D0",
              }}
            >
              <Text
                style={{ color: isSelected && !isLocked ? "white" : "black" }}
              >
                {`${option.emoji} ${option.label}`}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
