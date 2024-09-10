import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

type Question = {
  label: string
  options: string[]
}

type Person = {
  name: string
}

const questions: Question[] = [
  {
    label: "What's their favorite season?",
    options: ["Spring 🌸", "Summer ☀️", "Fall 🍂", "Winter ❄️"],
  },
  {
    label: "Choose a hobby for them:",
    options: ["Reading 📚", "Sports 🏀", "Cooking 🍳", "Painting 🎨"],
  },
  {
    label: "Pick a superpower for them:",
    options: [
      "Flight ✈️",
      "Invisibility 👻",
      "Super strength 💪",
      "Teleportation 🚀",
    ],
  },
  {
    label: "Their favorite type of music?",
    options: ["Pop 🎵", "Rock 🎸", "Classical 🎻", "Hip-hop 🎤"],
  },
]

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
    <View style={styles.container}>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121212", // Dark background
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
