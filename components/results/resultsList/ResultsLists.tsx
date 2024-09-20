import React, { useState, useMemo } from "react"
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ListRenderItem,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"
import processQuizLists, { QuizItem } from "../proccessQuizLists"
import { useNotification } from "@/contexts/notification/NotificationContext"
import { questions, quizzes } from "../../../constants/questions/questions"
import NotificationDot from "../NotificationDot"
import collect from "../../collect"
import QuizItemComponent from "./QuizItemComponent"

interface ResultsListProps {
  setQuizItem: (quizItem: QuizItem) => void
  activeTab: "your" | "their"
  setActiveTab: (tab: "your" | "their") => void
}

const ResultsList: React.FC<ResultsListProps> = ({
  setQuizItem,
  activeTab,
  setActiveTab,
}) => {
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const { user, friends: friends } = useUser()
  const { notifications } = useNotification()

  const numYourNotifications = collect(
    notifications.filter(
      (notification) =>
        notification.selfId === user?.id && notification.selfOpened === false
    ),
    ["quizId"]
  ).length

  const numTheirNotifications = notifications.filter(
    (notification) =>
      notification.friendId === user?.id && !notification.friendOpened
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
      setQuizItem={setQuizItem}
      activeTab={activeTab}
      friends={friends}
      user={user}
    />
  )

  const renderTabWithNotification = (
    tabName: string,
    subtitle: string,
    isActive: boolean,
    notificationCount: number,
    iconName: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={styles.tabWithNotification}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={isActive ? (iconName.replace("-outline", "") as any) : iconName}
          size={30}
          color={isActive ? "#000" : "#79818D"}
        />
        {notificationCount > 0 && (
          <View
            style={[
              styles.notificationDotContainer,
              { right: iconName.startsWith("people") ? -8 : -6 },
            ]}
          >
            <NotificationDot count={notificationCount} />
          </View>
        )}
      </View>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {tabName}
      </Text>
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
            "Packs About You",
            "Questions your friends took about you",
            activeTab === "your",
            numYourNotifications,
            "person-outline"
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "their" && styles.activeTab]}
          onPress={() => setActiveTab("their")}
        >
          {renderTabWithNotification(
            "Packs About Friends",
            "Quizzes you took about you friends",
            activeTab === "their",
            numTheirNotifications,
            "people-outline"
          )}
        </TouchableOpacity>
      </View>
      {(activeTab === "your" ? yourQuizzes : theirQuizzes).length > 0 ? (
        <FlatList
          data={activeTab === "your" ? yourQuizzes : theirQuizzes}
          renderItem={renderQuizItem}
          keyExtractor={(item) =>
            item.quiz?.id.toString() + item.friendIds.join() + item.selfId
          }
          style={styles.list}
        />
      ) : (
        <View style={styles.emptyListContainer}>
          <Text style={styles.emptyListText}>
            {activeTab === "your"
              ? "Fill out some packs about yourself. Once your friends answer those questions in the stack, you can see what they said."
              : "Answer questions about your friends in the stack. Once they've filled out the pack with those questions, you can see how your answers compare."}
          </Text>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Light background for the entire list
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingTop: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#000",
    marginBottom: -1,
  },
  tabText: {
    paddingBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#79818D",
    textAlign: "center",
  },
  activeTabText: {
    color: "#000",
  },
  list: {
    flex: 1,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyListText: {
    color: "#79818D",
    textAlign: "center",
    fontSize: 20,
  },
  tabWithNotification: {
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    marginBottom: 5,
  },
  notificationDotContainer: {
    position: "absolute",
    top: -10,
  },
})

export default ResultsList
