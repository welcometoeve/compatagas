import { questions, Quiz, quizzes } from "@/components/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useUser } from "@/contexts/UserContext"
import React from "react"
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItem,
  TouchableOpacity,
} from "react-native"

const { width } = Dimensions.get("window")
const columnWidth = width / 2 - 15 // 15 is the total horizontal padding

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
          question.id === answer.questionId && answer.userId === user?.id
      )?.quizId === item.id
  )
  return (
    <TouchableOpacity style={styles.quizItem} onPress={onPress}>
      <Image source={item.src} style={[styles.quizImage]} />
      <Text style={styles.quizTitle}>{item.name}</Text>
      {answered && (
        <View style={styles.doneOverlay}>
          <Text style={styles.doneText}>Done!</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

type QuizzesViewProps = {
  setCurQuizId: (id: number) => void
}

const QuizList: React.FC<QuizzesViewProps> = ({
  setCurQuizId,
}: QuizzesViewProps) => {
  const renderItem: ListRenderItem<Quiz> = ({ item }) => (
    <QuizItem
      item={item}
      onPress={() => {
        setCurQuizId(item.id)
      }}
    />
  )

  return (
    <>
      <Text style={styles.title}>Question Packs</Text>
      <Text style={styles.subtitle}>
        Answer questions about yourself. Once your friends have answered those
        questions in the stack, you can see what they said.
      </Text>
      <FlatList<Quiz>
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 5,
    backgroundColor: "#111419", // Dark background for the entire list
  },
  row: {
    justifyContent: "space-between",
  },
  quizItem: {
    width: columnWidth,
    marginBottom: 10,
    backgroundColor: "#1E1E1E",
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
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 8,
  },
  title: {
    marginTop: 80,
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#79818D",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
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
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
})

export default QuizList
