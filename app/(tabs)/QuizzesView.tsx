import { Quiz, quizzes } from "@/constants/questions"
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
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")
const columnWidth = width / 2 - 15 // 15 is the total horizontal padding

type QuizItemProps = {
  item: Quiz
  onPress: () => void
}

const QuizItem: React.FC<QuizItemProps> = ({ item, onPress }) => (
  <TouchableOpacity style={styles.quizItem} onPress={onPress}>
    <Image source={item.src} style={styles.quizImage} />
    {/* <Text style={styles.quizName}>{item.name}</Text> */}
  </TouchableOpacity>
)

const QuizzesView: React.FC = () => {
  const renderItem: ListRenderItem<Quiz> = ({ item }) => (
    <QuizItem
      item={item}
      onPress={() => console.log(`Quiz ${item.id} pressed`)}
    />
  )

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#121212", // Dark background for the entire list
        flex: 1,
        paddingTop: 50,
      }}
    >
      <Text style={styles.title}>Quizzes for You</Text>
      <FlatList<Quiz>
        data={quizzes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 5,
    backgroundColor: "#121212", // Dark background for the entire list
  },
  row: {
    justifyContent: "space-between",
  },
  quizItem: {
    width: columnWidth,
    marginBottom: 10,
    backgroundColor: "#1E1E1E", // Darker background for each item
    borderRadius: 8,
    overflow: "hidden",
  },
  quizImage: {
    width: columnWidth,
    height: columnWidth, // Set height to be the same as width
    resizeMode: "cover",
  },
  quizName: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFFFFF", // White text for better contrast
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 40,
  },
})

export default QuizzesView
