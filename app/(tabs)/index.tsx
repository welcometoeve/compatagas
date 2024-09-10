import React, { useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from "react-native"

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

const { width } = Dimensions.get("window")

export default function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0)
  const [nextQuestionIndex, setNextQuestionIndex] = useState(1)
  const [nextPersonIndex, setNextPersonIndex] = useState(1)
  const slideAnim = useRef(new Animated.Value(0)).current

  const handleAnswer = () => {
    // Start the slide animation
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      // Update indices
      setCurrentQuestionIndex(nextQuestionIndex)
      setCurrentPersonIndex(nextPersonIndex)
      setNextQuestionIndex((nextQuestionIndex + 1) % questions.length)
      setNextPersonIndex((nextPersonIndex + 1) % people.length)

      // Reset the animation value
      slideAnim.setValue(0)
    })
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentPerson = people[currentPersonIndex]
  const nextQuestion = questions[nextQuestionIndex]
  const nextPerson = people[nextPersonIndex]

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.animatedContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <QuestionSet
            question={currentQuestion}
            person={currentPerson}
            onAnswer={handleAnswer}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedContainer,
            { transform: [{ translateX: Animated.add(slideAnim, width) }] },
          ]}
        >
          <QuestionSet
            question={nextQuestion}
            person={nextPerson}
            onAnswer={handleAnswer}
          />
        </Animated.View>
      </View>
    </View>
  )
}

const QuestionSet = ({
  question,
  person,
  onAnswer,
}: {
  question: Question
  person: Person
  onAnswer: () => void
}) => (
  <View style={styles.questionSet}>
    <Text style={styles.name}>{person.name}</Text>
    <Text style={styles.question}>{question.label}</Text>
    <View style={styles.buttonContainer}>
      {question.options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.button} onPress={onAnswer}>
          <Text style={styles.buttonText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Dark background
  },
  contentContainer: {
    width: width,
    height: "100%",
    overflow: "hidden",
  },
  animatedContainer: {
    width: width,
    height: "100%",
    position: "absolute",
  },
  questionSet: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF", // White text
  },
  question: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
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
