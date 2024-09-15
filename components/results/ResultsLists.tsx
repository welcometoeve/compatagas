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
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"
import processQuizLists, { QuizItem } from "./proccessQuizLists"
import { useNotification } from "@/contexts/NotificationContext"
import { questions, quizzes } from "../questions"
import NotificationDot from "./NotificationDot"

interface QuizItemComponentProps {
  item: QuizItem
  onPress: (item: QuizItem) => void
  activeTab: "your" | "their"
  allUsers: any[] // Replace 'any' with the correct type for users
  notifications: any[] // Replace 'any' with the correct type for notifications
  user: any // Replace 'any' with the correct type for user
}

const QuizItemComponent: React.FC<QuizItemComponentProps> = ({
  item,
  onPress,
  activeTab,
  allUsers,
  notifications,
  user,
}) => {
  const hasNotification = notifications.some(
    (n) =>
      (activeTab === "your" &&
        n.selfId === user?.id &&
        item.friendIds.includes(n.friendId)) ||
      (activeTab === "their" &&
        n.friendId === user?.id &&
        n.selfId === item.selfId)
  )

  return (
    <TouchableOpacity style={styles.quizItem} onPress={() => onPress(item)}>
      <View style={styles.notificationContainer}>
        {hasNotification && <NotificationDot count={1} showCount={false} />}
      </View>
      <Image source={item.quiz.src} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.quiz.name}</Text>
        <Text style={styles.quizSubtitle}>
          {activeTab === "your"
            ? `Taken by ${item.friendIds
                .map((id) => allUsers.find((user) => user.id === id)?.name)
                .join(", ")}`
            : `Taken for ${
                allUsers.find((user) => user.id === item.selfId)?.name
              }`}
        </Text>
      </View>
      <ChevronRight color="#fff" size={24} />
    </TouchableOpacity>
  )
}

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
  const { notifications } = useNotification()

  const numYourNotifications = notifications.filter(
    (notification) => notification.selfId === user?.id
  ).length

  const numTheirNotifications = notifications.filter(
    (notification) => notification.friendId === user?.id
  ).length

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

  const renderQuizItem: ListRenderItem<QuizItem> = ({ item }) => (
    <QuizItemComponent
      item={item}
      onPress={setQuizItem}
      activeTab={activeTab}
      allUsers={allUsers}
      notifications={notifications}
      user={user}
    />
  )

  const renderTabWithNotification = (
    tabName: string,
    isActive: boolean,
    notificationCount: number
  ) => (
    <View style={styles.tabWithNotification}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {tabName}
      </Text>
      <NotificationDot count={notificationCount} />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "your" && styles.activeTab]}
          onPress={() => setActiveTab("your")}
        >
          {renderTabWithNotification(
            "Your Quizzes",
            activeTab === "your",
            numYourNotifications
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "their" && styles.activeTab]}
          onPress={() => setActiveTab("their")}
        >
          {renderTabWithNotification(
            "Their Quizzes",
            activeTab === "their",
            numTheirNotifications
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={activeTab === "your" ? yourQuizzes : theirQuizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) =>
          item.quiz.id.toString() + item.friendIds.join() + item.selfId
        }
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
  notificationContainer: {
    width: 20,
    marginRight: 15,
    marginLeft: -20,
    alignItems: "center",
    justifyContent: "center",
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
  tabWithNotification: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeTabText: {
    color: "#fff", // White text color for active tab
  },
})

export default ResultsList
