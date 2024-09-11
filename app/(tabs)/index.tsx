import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
} from "react-native"
import { questions } from "../questions"

type Person = {
  name: string
}

const people: Person[] = [
  { name: "Samira" },
  { name: "Maarek" },
  { name: "Oren" },
  { name: "Morgan" },
]

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0)

  const handleAnswer = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length)
    setCurrentPersonIndex((prevIndex) => (prevIndex + 1) % people.length)
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentPerson = people[currentPersonIndex]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{currentPerson.name}</Text>
        <Text style={styles.question}>{currentQuestion.label}</Text>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={handleAnswer}
          >
            <Text style={styles.buttonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: "35%",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  toggleText: {
    color: "#FFFFFF",
    marginHorizontal: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF", // White text
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#E0E0E0", // Light gray text
  },
  button: {
    backgroundColor: "#BB86FC", // Purple accent color
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "100%",
  },
  buttonText: {
    color: "#000000", // Black text on purple button
    textAlign: "center",
    fontSize: 16,
  },
})
