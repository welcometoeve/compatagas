import React, { useMemo } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { quizzes, questions } from "@/components/questions"
import processQuizLists, { QuizItem } from "./proccessQuizLists"
import QuizListItem from "./QuizListItem"

interface ResultsListProps {
  setQuizItem: (quizItem: QuizItem) => void
  activeTab: "your" | "their"
  setActiveTab: React.Dispatch<React.SetStateAction<"your" | "their">>
}

const ResultsList: React.FC<ResultsListProps> = ({
  setQuizItem,
  activeTab,
  setActiveTab,
}) => {
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
        : {
            yourQuizzes: [],
            theirQuizzes: [],
          },
    [selfAnswers, friendAnswers, quizzes, user]
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
        renderItem={({ item }) => (
          <QuizListItem
            item={item}
            activeTab={activeTab}
            allUsers={allUsers}
            onPress={setQuizItem}
          />
        )}
        keyExtractor={(item) =>
          item.quiz.id.toString() + item.friendIds.join() + item.selfId
        }
        style={styles.list}
      />

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          {activeTab === "your"
            ? "Take a quiz to see results here."
            : "Fill out quizzes about your friends to see their results."}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingTop: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  list: {
    flex: 1,
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
