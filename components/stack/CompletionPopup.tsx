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
  completedQuizName: string
  completedFriendName: string
  onDismiss: () => void
  onContinue: () => void
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  completionAnimation,
  completedQuizName,
  completedFriendName,
  onDismiss,
  onContinue,
}) => {
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
          You've finished the {completedQuizName} for {completedFriendName}!
        </Text>
        <TouchableOpacity style={styles.continueButton} onPress={onContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
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
    color: "#FF4457",
    marginBottom: 10,
  },
  completionText: {
    fontSize: 18,
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#FF4457",
    padding: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
