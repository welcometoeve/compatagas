import React, { useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { Question } from "@/constants/questions/types"
import { insertName, quizzes } from "@/constants/questions/questions"
import { Ionicons } from "@expo/vector-icons"
import { useFriends } from "@/contexts/FriendsContext"
import { SelfAnswer } from "@/contexts/SelfAnswerContext"

interface CardContentsProps {
  selfUser: UserProfile | undefined
  question: Question | undefined
  isLoading: boolean
  handleAnswer: (index: number) => Promise<SelfAnswer | undefined>
  onSkip: () => void
  onNext: () => void
}

export const CardContents: React.FC<CardContentsProps> = ({
  selfUser,
  question,
  isLoading,
  handleAnswer,
  onSkip,
  onNext,
}) => {
  const quizId = question?.quizId
  const quizName = quizzes.find((q) => q.id === quizId)?.name

  const [selfAnswer, setSelfAnswer] = React.useState<SelfAnswer | undefined>()
  const [indexAnswered, setIndexAnswered] = React.useState<number | undefined>()

  useEffect(() => {
    setSelfAnswer(undefined)
    setIndexAnswered(undefined)
  }, [question, selfUser])

  return (
    <>
      <Text
        style={{
          marginBottom: 10,
          textAlign: "center",
          color: "gray",
          position: "absolute",
          top: 20,
        }}
      >
        {quizName?.toUpperCase()}
      </Text>

      <Text style={styles.name}>{selfUser?.name}</Text>
      <Text style={styles.question}>
        {insertName(question?.label.thirdPerson ?? "", selfUser?.name ?? "")}
      </Text>

      <View style={[styles.buttonContainer, { paddingBottom: 0 }]}>
        {question?.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.buttonWrapper}
            onPress={async () => {
              const sa = await handleAnswer(index)
              setSelfAnswer(sa)
              setIndexAnswered(index)
            }}
            disabled={isLoading || !!selfAnswer}
          >
            <View
              style={[
                styles.button,
                {
                  backgroundColor:
                    indexAnswered !== index
                      ? "#F0F0F0"
                      : indexAnswered === selfAnswer?.optionIndex
                      ? "#5AF675"
                      : "#EA4235",
                },
              ]}
            >
              <Text style={styles.buttonEmoji}>{`${option.emoji}`}</Text>
              <Text style={[styles.buttonText, { color: "black" }]}>
                {insertName(option.label.thirdPerson, selfUser?.name ?? "")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      {selfAnswer ? (
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>NEXT</Text>
          <Ionicons name="arrow-forward" color="white" size={20} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>SKIP</Text>
          <Ionicons name="arrow-forward" color="gray" size={16} />
        </TouchableOpacity>
      )}
    </>
  )
}

interface CardStackProps {
  renderCardContents: (current: boolean) => React.ReactNode
  slideAnimation: Animated.Value
}

export const CardStack: React.FC<CardStackProps> = ({
  renderCardContents,
  slideAnimation,
}) => (
  <View style={styles.cardStack}>
    <View
      style={[styles.cardContainer, styles.stackedCard, styles.bottomCard]}
    />
    <View
      style={[styles.cardContainer, styles.stackedCard, styles.middleCard]}
    />
    <View
      style={[
        styles.cardContainer,
        {
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 3.84,
        },
      ]}
    >
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

export const OutOfQuestionsView: React.FC = () => {
  const { getFriends } = useFriends()
  const { user } = useUser()

  const friends = user ? getFriends(user?.id) : []
  return (
    <View style={styles.contentContainer}>
      {friends.length <= 1 ? (
        <>
          <Text style={styles.outOfQuestionsText}>
            Add friends to start answering questions
          </Text>
          <TouchableOpacity
            style={styles.addFriendsButton}
            // onPress={() => setPage("profile")}
          >
            <Text style={styles.addFriendsButtonText}>Add Friends</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.outOfQuestionsText}>Out of questions for now!</Text>
      )}
    </View>
  )
}

export const ExplanationText: React.FC = () => (
  <Text style={styles.explanationText}>
    Answer questions about your friends to see what they said about themselves.
  </Text>
)

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  question: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    color: "#333333",
    width: "100%",
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 7,
  },
  buttonWrapper: {
    marginVertical: 5,
    width: "100%",
  },
  button: {
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 5,
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  buttonEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 20,
    flex: 1,
    flexWrap: "wrap",
  },
  cardStack: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 30,
  },
  stackedCard: {
    position: "absolute",
    width: "100%",
    height: "90%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  bottomCard: {
    top: 44,
    width: "90%",
  },
  middleCard: {
    top: 38,
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
    zIndex: 3,
    elevation: 3,
    borderWidth: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
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
    paddingBottom: 25,
    zIndex: 2,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
    padding: 10,
  },
  skipButtonText: {
    color: "gray",
    marginRight: 5,
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    position: "absolute",
    bottom: 30,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  addFriendsButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    marginTop: 30,
    borderRadius: 12,
  },
  addFriendsButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
})
