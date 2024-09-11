import React, { useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  SafeAreaView,
} from "react-native"

type Question = {
  label: string
  options: string[]
}

type Person = {
  name: string
}

const basicQuestions: Question[] = [
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

const compatagramQuestions: Question[] = [
  {
    label: "Perpetually horny or nun or perpetually horny nun?",
    options: ["Nun 🙏", "Perpetually horny 😈", "Perpetually horny nun 😇😈"],
  },
  {
    label: "Eat a sandwich or get walked around on a leash like a dog?",
    options: ["Eat a sandwich 🥪", "Get walked on a leash 🐕"],
  },
  {
    label: "From the front or from the back?",
    options: ["From the front 😊", "From the back 😏"],
  },
  {
    label: "Church or dropping it like a thotty?",
    options: ["Church 🙏", "Dropping it like a thotty 💃"],
  },
  {
    label: "Classified camera roll or open book?",
    options: ["Open book 📖", "Classified camera roll 🔒"],
  },
  {
    label: "Sex on the first date or leave room for Jesus?",
    options: ["Leave room for Jesus 🙏", "Sex on the first date 😘"],
  },
  {
    label: "Do whips and chains excite you?",
    options: ["No 🚫", "Yes 🔗"],
  },
  {
    label: "Sending selfies or sending feet pics?",
    options: ["Sending selfies 🤳", "Sending feet pics 🦶"],
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
  const [isCompatagram, setIsCompatagram] = useState(false)

  const handleAnswer = () => {
    const questions = isCompatagram ? compatagramQuestions : basicQuestions
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length)
    setCurrentPersonIndex((prevIndex) => (prevIndex + 1) % people.length)
  }

  const toggleQuestionType = () => {
    setIsCompatagram((prev) => !prev)
    setCurrentQuestionIndex(0)
  }

  const questions = isCompatagram ? compatagramQuestions : basicQuestions
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
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Basic</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isCompatagram ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleQuestionType}
          value={isCompatagram}
        />
        <Text style={styles.toggleText}>Compatagram</Text>
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
    paddingTop: "45%",
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
