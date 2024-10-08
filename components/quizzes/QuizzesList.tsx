import React from "react"
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native"
import { Quiz } from "@/constants/questions/types"
import { questions, quizzes } from "@/constants/questions/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { usePage } from "@/contexts/PageContext"

const { width } = Dimensions.get("window")
const columnWidth = width / 2 - 20

type QuizItemProps = {
  item: Quiz
  onPress: () => void
}

const QuizItem: React.FC<QuizItemProps> = ({ item, onPress }) => {
  const { selfAnswers } = useSelfAnswers()
  const { user } = useUser()
  const answered = selfAnswers.some(
    (answer) =>
      questions.find(
        (question) =>
          question.id === answer.questionId && answer.userId == user?.id
      )?.quizId === item.id
  )

  return (
    <TouchableOpacity style={styles.quizItem} onPress={onPress}>
      <Image source={item.src} style={styles.quizImage} />
      <Text style={styles.quizTitle}>{item.name}</Text>
      {answered && (
        <View style={styles.doneOverlay}>
          <Text style={styles.doneText}>Done!</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

type QuizzesViewProps = {}

const QuizList: React.FC<QuizzesViewProps> = ({}) => {
  const { pushPage } = usePage()
  const { user } = useUser()
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Question Packs</Text>
        <Text style={styles.subtitle}>
          Answer questions about yourself. Once your friends have answered those
          questions in the stack, you can see what they said.
        </Text>
      </View>
      <View style={styles.quizGrid}>
        {quizzes.map((quiz) => (
          <QuizItem
            key={quiz.id}
            item={quiz}
            onPress={() =>
              pushPage({
                type: "takeQuiz",
                quizId: quiz.id,
                userId: user?.id ?? 0,
              })
            }
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
  },
  quizGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  quizItem: {
    width: columnWidth,
    marginBottom: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  quizImage: {
    width: columnWidth,
    height: columnWidth,
    resizeMode: "cover",
  },
  quizTitle: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 8,
  },
  title: {
    marginTop: 60,
    fontSize: 38,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  doneOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  doneText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
})

export default QuizList
