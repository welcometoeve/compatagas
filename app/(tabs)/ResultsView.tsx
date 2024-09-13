import { Quiz, quizzes, Question, questions } from "@/components/questions"
import React, { useState, useMemo } from "react"
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronRight } from "lucide-react-native"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"

const ResultsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"your" | "their">("your")
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const { user, allUsers } = useUser()

  const filterQuizzes = (
    quizzes: Quiz[],
    selfAnswers: SelfAnswer[],
    friendAnswers: FriendAnswer[]
  ): Quiz[] => {
    if (activeTab === "your") {
      return quizzes.filter((quiz) => {
        const quizQuestions = questions.filter(
          (question) => question.quizId === quiz.id
        )

        const youFilledIn = !!selfAnswers.find(
          (answer) => answer.userId === user?.id && answer.quizId === quiz.id
        )
        const friendFilledIn = friendAnswers
          .filter((answer) => {
            const matches =
              answer.quizId === quiz.id && answer.selfId === user?.id
            return matches
          })
          .reduce((acc, current) => {
            acc[current.friendId] = (acc[current.friendId] || 0) + 1
            return acc
          }, {} as Record<string, number>)

        const atLeastOneFriendFilledAll = Object.values(friendFilledIn).some(
          (count) => count >= quizQuestions.length
        )
        return youFilledIn && atLeastOneFriendFilledAll
      })
    } else {
      return quizzes.flatMap((quiz) => {
        const youAnswers = friendAnswers.filter(
          (answer) => answer.friendId === user?.id && answer.quizId === quiz.id
        )
        const k: Quiz[] = []
        const quizQuestions = questions.filter(
          (question) => question.quizId === quiz.id
        )
        for (const user of allUsers) {
          const userAnswers = youAnswers.filter(
            (answer) => answer.selfId === user.id
          )
          if (userAnswers.length >= quizQuestions.length) {
            k.push(quiz)
          }
        }
        return k
      })
    }
  }

  const quizItems = useMemo(
    () => filterQuizzes(quizzes, selfAnswers, friendAnswers),
    [quizzes, selfAnswers, friendAnswers, user?.id]
  )

  const renderQuizItem = ({ item }: { item: Quiz }) => (
    <TouchableOpacity style={styles.quizItem}>
      <Image source={item.src} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.name}</Text>
        <Text
          style={styles.quizSubtitle}
        >{`${item.leftLabel} vs ${item.rightLabel}`}</Text>
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
        data={quizItems}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id.toString()}
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

export default ResultsView
