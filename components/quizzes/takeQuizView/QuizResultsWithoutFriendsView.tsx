import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { ChevronRight } from "lucide-react"
import { LinearGradient } from "expo-linear-gradient"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { Quiz } from "@/constants/questions/types"
import { useFriends } from "@/contexts/FriendsContext"

interface QuizResultsWithoutFriendsViewProps {
  friendsWhoTookQuiz: number[]
  quiz: Quiz
  quizResult: number
  selfId: number
}

const QuizResultsWithoutFriendsView: React.FC<
  QuizResultsWithoutFriendsViewProps
> = ({ friendsWhoTookQuiz, quiz, quizResult, selfId }) => {
  const verb = friendsWhoTookQuiz.length === 1 ? "has" : "have"
  const { user } = useUser()
  const { allUsers } = useFriends()

  const sliderPosition = mapRange(quizResult, -1, 1, 0, 100)
  const resultLabel = quiz.resultLabels
    ? quiz.resultLabels[getResultLabel(quizResult)]
    : null

  const self = allUsers.find((user) => user.id === selfId)
  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.title}>
          {self?.id === user?.id ? "You Are:" : `${self?.name} is:`}
        </Text>
        <Text style={styles.subtitle}>
          {`${resultLabel?.label} ${resultLabel?.emoji}`}
        </Text>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>{quiz.leftLabel}</Text>
          <Text style={styles.label}>{quiz.rightLabel}</Text>
        </View>
        <View style={styles.sliderContainer}>
          <LinearGradient
            colors={["#E0E0E0", "#E0E0E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sliderBackground}
          />
          <View style={[styles.sliderThumb, { left: `${sliderPosition}%` }]} />
        </View>
      </View>
      {selfId === user?.id && (
        <Text style={[styles.friendsText, { color: "gray" }]}>
          Wait for your friends to take the quiz to compare results
        </Text>
      )}
    </View>
  )
}

function getResultLabel(value: number): number {
  if (value < -1 || value > 1) {
    throw new Error("Input must be between -1 and 1")
  }
  const index = Math.min(Math.floor((value + 1) / 0.4), 4)
  return index
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 0,
    marginBottom: 24,
    padding: 16,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  friendsText: {
    color: "#FF4457",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  resultContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    color: "#666666",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    color: "#333333",
    fontSize: 24,
    marginBottom: 35,
    textAlign: "center",
    fontWeight: "bold",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#333333",
    fontSize: 14,
    fontWeight: "600",
  },
  sliderContainer: {
    position: "relative",
    height: 24,
  },
  sliderBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  sliderThumb: {
    position: "absolute",
    top: -4,
    transform: [{ translateX: -16 }],
    width: 32,
    height: 32,
    backgroundColor: "#1E90FF",
    borderRadius: 16,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  button: {
    backgroundColor: "#FF4457",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 8,
  },
})

export default QuizResultsWithoutFriendsView

function mapRange(
  value: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number
): number {
  // First, normalize the value in the input range
  const normalizedValue = (value - xMin) / (xMax - xMin)

  // Then, map the normalized value to the output range
  return yMin + normalizedValue * (yMax - yMin)
}
