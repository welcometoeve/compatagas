import React from "react"
import { Question, Side } from "@/constants/questions"
import { TouchableOpacity, View, Text } from "react-native"

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
}

export default function QuestionView({
  question,
  answers,
  lockedAnswers,
  handleOptionSelect,
  index,
}: QuestionViewProps) {
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
        {question.label.secondPerson}
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
                {`${option.emoji} ${option.label.secondPerson}`}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
