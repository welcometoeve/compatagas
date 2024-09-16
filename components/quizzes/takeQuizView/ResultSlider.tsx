import { Quiz } from "@/components/questions"
import { View, Text } from "react-native"

export default function ResultSlider({
  quiz,
  quizResult,
}: {
  quiz: Quiz
  quizResult: number
}) {
  const sliderPosition = ((quizResult + 1) / 2) * 100
  const leftPosition = `${sliderPosition}%`

  return (
    <View style={{ marginTop: 24, marginBottom: 24 }}>
      <Text style={{ color: "white", marginBottom: 8, textAlign: "center" }}>
        Your Result
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: "white" }}>{quiz.leftLabel}</Text>
        <Text style={{ color: "white" }}>{quiz.rightLabel}</Text>
      </View>
      <View
        style={{
          height: 20,
          backgroundColor: "#262C34",
          borderRadius: 10,
          marginTop: 8,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: `${sliderPosition}%`,
            transform: [{ translateX: -14 }],
            marginTop: -4,
            width: 28,
            height: 28,
            backgroundColor: "#FF4457",
            borderRadius: 14,
          }}
        />
      </View>
    </View>
  )
}
