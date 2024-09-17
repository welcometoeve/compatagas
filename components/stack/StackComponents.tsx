import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native"
import { Question } from "../questions"
import CompletionScreen from "@/components/stack/CompletionPopup"
import { UserProfile } from "@/contexts/UserContext"

interface CardContentsProps {
  friend: UserProfile | undefined
  question: Question | undefined
  quiz: { name: string; src: any } | undefined
  isLoading: boolean
  handleAnswer: (index: number) => void
}

export const CardContents: React.FC<CardContentsProps> = ({
  friend,
  question,
  quiz,
  isLoading,
  handleAnswer,
}) => (
  <>
    <Text style={styles.name}>{friend?.name}</Text>
    <Text style={styles.question}>{question?.thirdPersonLabel}</Text>
    {isLoading ? (
      <Text style={styles.loadingText}>Loading...</Text>
    ) : (
      <View style={{ width: "100%", paddingHorizontal: 5 }}>
        {question?.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => handleAnswer(index)}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>{`${option.emoji}`}</Text>
            <Text style={styles.buttonText}> {option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
    {/* {quiz && (
      <View style={styles.quizInfoContainer}>
        <Image source={quiz.src} style={styles.quizImage} />
        <Text style={styles.quizName}>{`From the ${quiz.name}`}</Text>
      </View>
    )} */}
  </>
)

interface CardStackProps {
  renderCardContents: (current: boolean) => React.ReactNode
  slideAnimation: Animated.Value
}

export const CardStack: React.FC<CardStackProps> = ({
  renderCardContents,
  slideAnimation,
}) => (
  <View style={styles.cardStack}>
    <View style={[styles.cardContainer, { position: "absolute" }]}>
      {renderCardContents(false)}
    </View>
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ translateX: slideAnimation }],
        },
      ]}
    >
      {renderCardContents(true)}
    </Animated.View>
  </View>
)

export const OutOfQuestionsView: React.FC = () => (
  <View style={styles.contentContainer}>
    <Text style={styles.outOfQuestionsText}>Out of questions for now!</Text>
  </View>
)

export const ExplanationText: React.FC = () => (
  <Text style={styles.explanationText}>
    Answer questions about your friends to see what they said about themselves.
  </Text>
)

export { CompletionScreen }

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  question: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 20,
    color: "#333333",
    width: "100%",
    paddingHorizontal: 5,
    fontWeight: "bold",
  },
  button: {
    padding: 10,
    borderRadius: 16,
    marginVertical: 7,
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
    borderWidth: 1.5,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
    // elevation: 5,
  },
  buttonText: {
    color: "black",
    textAlign: "left",
    fontSize: 20,
    paddingVertical: 5,
  },
  loadingText: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
  },
  quizInfoContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
    borderTopColor: "#E0E0E0",
    borderTopWidth: 2,
    width: "100%",
    paddingTop: 15,
  },
  quizImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 10,
  },
  quizName: {
    fontSize: 16,
    color: "#333333",
    fontWeight: "bold",
  },
  cardStack: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  stackedCard: {
    position: "absolute",
    width: "100%",
    height: "90%",
    borderWidth: 3,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    backgroundColor: "#F5F5F5",
  },
  bottomCard: {
    top: 50,
    width: "90%",
  },
  middleCard: {
    top: 40,
    width: "95%",
  },
  cardContainer: {
    width: "100%",
    height: "90%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#E0E0E0",
    padding: 0,
    borderRadius: 30,
    paddingHorizontal: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 3,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  outOfQuestionsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },
  explanationText: {
    fontSize: 16,
    color: "rgb(150, 150, 150)",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 30,
  },
})
