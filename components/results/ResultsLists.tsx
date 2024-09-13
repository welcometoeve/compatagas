import { Quiz, quizzes, Question, questions } from "@/components/questions"
import React, { useState, useMemo } from "react"
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronRight } from "lucide-react-native"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"
import collect from "@/components/collect"
import { act } from "react-test-renderer"
import processQuizLists from "@/components/proccessQuizLists"

export interface QuizItem {
  quiz: Quiz
  theirIds: number[]
}

const ResultsList: React.FC<{ setQuizItem: (quizItem: QuizItem) => void }> = ({
  setQuizItem,
}: {
  setQuizItem: (quizItem: QuizItem) => void
}) => {
  const [activeTab, setActiveTab] = useState<"your" | "their">("your")
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const { user, allUsers } = useUser()

  const { yourQuizzes, theirQuizzes } = useMemo(
    () =>
      user
        ? processQuizLists(
            friendAnswers,
            selfAnswers,
            quizzes,
            questions,
            user?.id
          )
        : { yourQuizzes: [], theirQuizzes: [] },
    [selfAnswers, friendAnswers, quizzes, user]
  )

  const renderQuizItem: ListRenderItem<{ quiz: Quiz; theirIds: number[] }> = ({
    item,
  }) => (
    <TouchableOpacity style={styles.quizItem} onPress={() => setQuizItem(item)}>
      <Image source={item.quiz.src} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.quiz.name}</Text>
        <Text style={styles.quizSubtitle}>
          {activeTab === "your"
            ? `Take By: ${item.theirIds
                .map((id) => allUsers.find((user) => user.id === id)?.name)
                .join(", ")}`
            : `Taken For: ${
                allUsers.find((user) => user.id === item.theirIds[0])?.name
              }`}
        </Text>
      </View>
      <ChevronRight color="#fff" size={24} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "your" && styles.activeTab]}
          onPress={() => setActiveTab("your")}
        >
          <Text style={styles.tabText}>Your Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "their" && styles.activeTab]}
          onPress={() => setActiveTab("their")}
        >
          <Text style={styles.tabText}>Their Quizzes</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === "your" ? yourQuizzes : theirQuizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.quiz.id.toString() + item.theirIds.join()}
        style={styles.list}
      />

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          {activeTab === "your"
            ? "Quiz results will show up when someone else has taken them about you."
            : "Quiz results will show up when you have taken them about someone else."}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark mode background color
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Darker border color
    paddingTop: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff", // White border for active tab
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // White text color
  },
  list: {
    flex: 1,
  },
  quizItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Darker border color
    height: 100, // Increased height
  },
  quizImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 5, // Rounded corners
  },
  quizInfo: {
    flex: 1,
    justifyContent: "center",
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // White text color
    marginBottom: 5, // Added space between title and subtitle
  },
  quizSubtitle: {
    fontSize: 14,
    color: "#aaa", // Light gray text color
  },
  bottomTextContainer: {
    paddingHorizontal: 40,
    paddingBottom: 0,
  },
  bottomText: {
    color: "gray",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
})

export default ResultsList
