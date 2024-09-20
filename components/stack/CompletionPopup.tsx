import { questions } from "@/constants/questions/questions"
import { Quiz } from "@/constants/questions/types"
import { usePage } from "@/contexts/PageContext"
import { useUser } from "@/contexts/UserContext"
import { Ionicons } from "@expo/vector-icons"
import React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native"

interface CompletionScreenProps {
  completionAnimation: Animated.Value
  completedQuiz: Quiz
  completedQuizSelfId: number
  onDismiss: () => void
  onContinue: () => void
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  completionAnimation,
  completedQuiz,
  completedQuizSelfId,
  onDismiss,
  onContinue,
}) => {
  const { setPage, setActiveResultsTab, setCurQuizResultItem } = usePage()
  const { friends: friends, user } = useUser()
  return (
    <View style={styles.completionOverlay}>
      <Animated.View
        style={[
          styles.completionContainer,
          {
            opacity: completionAnimation,
            transform: [
              {
                scale: completionAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Text style={styles.dismissButtonText}>×</Text>
        </TouchableOpacity>
        <Text style={styles.completionTitle}>Pack Completed!</Text>
        <Text style={styles.completionText}>
          You've finished the {completedQuiz.name} for{" "}
          {friends.find((u) => u.id === completedQuizSelfId)?.name}!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewResultsButton}
            onPress={() => {
              setPage("results")
              setActiveResultsTab("their")
              setCurQuizResultItem({
                quiz: completedQuiz,
                friendIds: user ? [user?.id] : [],
                selfId: completedQuizSelfId,
              })
            }}
          >
            <Text style={styles.viewResultsButtonText}>View Results</Text>
            {/* <Ionicons name="chevron-forward" size={24} color="white" /> */}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  completionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  completionContainer: {
    width: "80%",
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  completionText: {
    fontSize: 18,
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#3A93F4",
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    flex: 1,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  viewResultsButton: {
    backgroundColor: "#FF4457",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  viewResultsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  dismissButton: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 5,
  },
  dismissButtonText: {
    color: "#999",
    fontSize: 20,
    fontWeight: "bold",
  },
})

export default CompletionScreen
