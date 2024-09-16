import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Quiz } from "@/components/questions"

type Result = {
  id: number
  name: string
  value: number
  isSelf: boolean
}

type ResultSliderProps = {
  quiz: Quiz
  results: Result[]
}

const ResultResultSlider: React.FC<ResultSliderProps> = ({ quiz, results }) => {
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
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{quiz.leftLabel}</Text>
        <Text style={styles.label}>{quiz.rightLabel}</Text>
      </View>
      <View style={styles.sliderContainer}>
        {Object.entries(groupedResults).map(([value, groupResults]) => {
          const sliderPosition = ((parseFloat(value) + 1) / 2) * 100
          const names = groupResults.map((r) => r.name).join(", ")

          return (
            <React.Fragment key={value}>
              {groupResults.map((result) => (
                <View key={result.id} style={styles.resultContainer}>
                  <View
                    style={[
                      styles.dot,
                      { left: `${sliderPosition}%` },
                      result.isSelf ? styles.selfDot : styles.friendDot,
                    ]}
                  />
                </View>
              ))}
              <Text style={[styles.resultName, { left: `${sliderPosition}%` }]}>
                {names}
              </Text>
            </React.Fragment>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    color: "white",
    marginBottom: 8,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "white",
  },
  sliderContainer: {
    height: 20,
    backgroundColor: "#262C34",
    borderRadius: 20,
    position: "relative",
  },
  resultContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  dot: {
    position: "absolute",
    width: 28,
    height: 28,
    borderRadius: 500000,
    marginLeft: -14,
    marginTop: -4,
  },
  selfDot: {
    backgroundColor: "#FF4457",
    zIndex: 2,
  },
  friendDot: {
    borderWidth: 2,
    borderColor: "white",
    zIndex: 1,
    height: 20,
    width: 20,
    marginLeft: -10,
    marginTop: -0,
  },
  resultName: {
    position: "absolute",
    top: 40,
    color: "white",
    fontSize: 12,
    marginLeft: -50,
    textAlign: "center",
    width: 100, // Added to give some width for multiline text
  },
})

export default ResultResultSlider
