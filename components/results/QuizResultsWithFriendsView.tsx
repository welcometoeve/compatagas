import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { Quiz } from "@/constants/questions/types"
import { Entypo, Ionicons } from "@expo/vector-icons"
import { useUser } from "@/contexts/UserContext"

type Result = {
  id: number
  name: string
  value: number
  isSelf: boolean
  correctPercentage?: number
}

type QuizResultsWithFriendsViewProps = {
  quiz: Quiz
  results: Result[]
  quizResult: number
  quizType: "your" | "their"
}

const QuizResultsWithFriendsView: React.FC<QuizResultsWithFriendsViewProps> = ({
  quiz,
  results,
  quizResult,
  quizType,
}) => {
  const sliderPosition = ((quizResult + 1) / 2) * 100
  const resultLabel = quiz.resultLabels
    ? quiz.resultLabels[getResultLabel(quizResult)]
    : null

  const { user } = useUser()

  // Group results by their value
  const groupedResults = results.reduce((acc, result) => {
    const key = result.value.toString()
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(result)
    return acc
  }, {} as Record<string, Result[]>)

  const namesNames: string[] = Object.values(groupedResults).map((group) =>
    group.map((result) => result.name).join(", ")
  )

  const longestLength =
    namesNames.length > 0
      ? Math.max(...namesNames.map((item) => item.length))
      : 0

  return (
    <View style={styles.container}>
      <View
        style={[styles.resultContainer, { marginBottom: longestLength * 5 }]}
      >
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
          <View style={[{ left: `${sliderPosition}%` }]} />
          {Object.entries(groupedResults).map(([value, groupResults]) => {
            const position = ((parseFloat(value) + 1) / 2) * 100
            let names = groupResults.map((r) => r.name).join(", ")

            // Sort the results to put self results first
            const sortedResults = groupResults.sort(
              (a, b) => (b.isSelf ? 1 : 0) - (a.isSelf ? 1 : 0)
            )

            return (
              <React.Fragment key={value}>
                {sortedResults.map((result, index) => (
                  <View
                    key={result.id}
                    style={[
                      styles.dot,
                      { left: `${position}%` },
                      { marginTop: -8, zIndex: result.isSelf ? 2 : 1 },
                      {
                        backgroundColor: result.isSelf ? "#007AFF" : "#75B7FF",
                      },
                    ]}
                  >
                    {!result.isSelf && index === 0 ? (
                      <Text style={styles.dotText}>{groupResults.length}</Text>
                    ) : result.isSelf && groupResults.length > 1 ? (
                      <Text style={styles.dotText}>{`+${
                        groupResults.length - 1
                      }`}</Text>
                    ) : null}
                  </View>
                ))}
                <View
                  style={[
                    styles.resultNameContainer,
                    { left: `${position + 7}%` },
                    {
                      paddingLeft: 35,
                      zIndex: groupResults.some((r) => r.isSelf) ? 2 : 1,
                    },
                  ]}
                >
                  <Text style={styles.resultName}>{names}</Text>
                </View>
              </React.Fragment>
            )
          })}
        </View>
      </View>
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
    paddingVertical: 32,
    paddingTop: 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingBottom: 36,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 32,
    textAlign: "center",
  },
  checkmark: {
    marginLeft: 8,
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
    fontSize: 16,
    fontWeight: "600",
  },
  sliderContainer: {
    position: "relative",
    height: 10,
    marginTop: 12,
  },
  sliderBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  dot: {
    position: "absolute",
    top: -1,
    width: 26,
    height: 26,
    borderRadius: 200000,
    backgroundColor: "#FF4457",
    transform: [{ translateX: -13 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resultNameContainer: {
    position: "absolute",
    top: 24,
    marginLeft: -50,
    width: 100,
    transform: [{ rotate: "45deg" }],
  },
  resultName: {
    color: "#333333",
    fontSize: 12,
    textAlign: "left",
  },
  dotText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default QuizResultsWithFriendsView
