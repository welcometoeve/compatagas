import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Quiz } from "@/constants/questions"

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
}

const QuizResultsWithFriendsView: React.FC<QuizResultsWithFriendsViewProps> = ({
  quiz,
  results,
  quizResult,
}) => {
  const sliderPosition = ((quizResult + 1) / 2) * 100
  const resultLabel = quiz.resultLabels
    ? quiz.resultLabels[getResultLabel(quizResult)]
    : null

  // Group results by their value
  const groupedResults = results.reduce((acc, result) => {
    const key = result.value.toString()
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(result)
    return acc
  }, {} as Record<string, Result[]>)

  return (
    <View style={styles.container}>
      <View style={styles.resultContainer}>
        <Text style={styles.title}>You Are:</Text>
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
          <View style={[{ left: `${sliderPosition}%` }]} />
          {Object.entries(groupedResults).map(([value, groupResults]) => {
            const friendPosition = ((parseFloat(value) + 1) / 2) * 100
            const names = groupResults.map((r) => r.name).join(", ")

            return (
              <React.Fragment key={value}>
                {groupResults.map((result) => (
                  <View
                    key={result.id}
                    style={[
                      styles.friendDot,
                      { left: `${friendPosition}%` },
                      // result.isSelf ? styles.selfDot : null,
                    ]}
                  />
                ))}
                <Text
                  style={[styles.resultName, { left: `${friendPosition}%` }]}
                >
                  {names}
                </Text>
              </React.Fragment>
            )
          })}
        </View>
      </View>
      <View style={styles.friendsResultContainer}>
        {results.map((result) => (
          <View key={result.id} style={styles.friendResult}>
            <Text style={styles.friendName}>{result.name}</Text>
            <View style={styles.scoreContainer}>
              {result.correctPercentage !== undefined && (
                <Text style={styles.friendScore}>
                  {`${result.correctPercentage.toFixed(0)}% correct`}
                </Text>
              )}
              <Text style={styles.friendValue}>
                {`${(((result.value + 1) / 2) * 100).toFixed(0)}%`}
              </Text>
            </View>
          </View>
        ))}
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
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
  // sliderThumb: {
  //   position: "absolute",
  //   top: -4,
  //   transform: [{ translateX: -16 }],
  //   width: 32,
  //   height: 32,
  //   backgroundColor: "#1E90FF",
  //   borderRadius: 16,
  //   borderWidth: 2,
  //   borderColor: "#FFFFFF",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3.84,
  //   elevation: 3,
  // },
  friendDot: {
    position: "absolute",
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF4457",
    transform: [{ translateX: -12 }],
  },
  selfDot: {
    zIndex: 2,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  resultName: {
    position: "absolute",
    top: 24,
    color: "#333333",
    fontSize: 12,
    marginLeft: -50,
    textAlign: "center",
    width: 100,
  },
  friendsResultContainer: {
    marginTop: 24,
  },
  friendResult: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  friendName: {
    fontSize: 16,
    color: "#333333",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  friendScore: {
    fontSize: 14,
    color: "#666666",
    marginRight: 8,
  },
  friendValue: {
    fontSize: 16,
    color: "#FF4457",
    fontWeight: "bold",
  },
})

export default QuizResultsWithFriendsView
