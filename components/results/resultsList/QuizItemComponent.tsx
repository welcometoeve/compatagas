import React from "react"
import { useNotification } from "@/contexts/notification/NotificationContext"
import { QuizItem } from "../proccessQuizLists"
import * as Haptics from "expo-haptics"
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import NotificationDot from "../NotificationDot"
import { ChevronRight } from "lucide-react-native"
import { LockClosedIcon } from "react-native-heroicons/outline"
import { User } from "@supabase/supabase-js"
import { UserProfile, useUser } from "@/contexts/UserContext"

interface QuizItemComponentProps {
  item: QuizItem
  setQuizItem: (item: QuizItem) => void
  activeTab: "your" | "their"
  friends: any[] // Replace 'any' with the correct type for users
}

const QuizItemComponent: React.FC<QuizItemComponentProps> = ({
  item,
  setQuizItem,
  activeTab,
  friends,
}) => {
  const { notifications, markAsOpened } = useNotification()
  const { user } = useUser()
  const isLocked =
    !user?.unlockedQuizIds.find((id) => id === item.quiz.id) &&
    activeTab === "your"
  const relevantNs = notifications.filter(
    (n) =>
      (activeTab === "your" &&
        n.selfOpened === false &&
        n.selfId === user?.id &&
        item.friendIds.includes(n.friendId) &&
        n.quizId === item.quiz.id) ||
      (activeTab === "their" &&
        n.friendOpened === false &&
        n.friendId === user?.id &&
        n.selfId === item.selfId &&
        n.quizId === item.quiz.id)
  )

  const triggerHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch (error) {
      console.error("Failed to trigger haptic:", error)
    }
  }

  const renderSubtitle = () => {
    const prefix = activeTab === "your" ? "Taken by" : "Taken for"
    const names =
      activeTab === "your"
        ? item.friendIds
            .map((id) => friends.find((user) => user?.id === id)?.name)
            .join(", ")
        : friends.find((user) => user?.id === item.selfId)?.name

    return (
      <View style={styles.subtitleContainer}>
        <Text style={styles.quizSubtitle}>{prefix}</Text>
        <View style={styles.blurContainer}>
          <Text style={styles.quizSubtitle}>{names}</Text>
          <BlurView
            intensity={isLocked ? 12 : 0}
            tint="light"
            style={styles.absoluteFill}
          />
        </View>
      </View>
    )
  }

  return (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={async () => {
        setQuizItem(item)
        relevantNs.forEach((notification) =>
          markAsOpened(notification, activeTab === "your")
        )
        // relevantNs.length > 0 && (await triggerHaptic())
      }}
    >
      <View style={styles.imageContainer}>
        <Image source={item.quiz.src} style={styles.quizImage} />
        {relevantNs.length > 0 && (
          <View style={styles.notificationContainer}>
            <NotificationDot count={1} showCount={false} />
          </View>
        )}
        {!user?.unlockedQuizIds.find((id) => id === item.quiz.id) &&
          activeTab === "your" && (
            <View style={styles.lockIconContainer}>
              <LockClosedIcon color="gray" size={16} />
            </View>
          )}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.quizInfo}>
          <Text style={styles.quizTitle}>{item.quiz.name}</Text>
          {renderSubtitle()}
        </View>
        <View style={styles.chevronContainer}>
          <ChevronRight color="#000" size={24} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  quizItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    marginVertical: 5,
    height: 120,
    position: "relative",
  },
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
  },
  quizImage: {
    width: 90,
    height: 90,
    borderRadius: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 0,
    borderBottomWidth: 1,
    height: 130,
    borderBottomColor: "#E0E0E0",
  },
  quizInfo: {
    flex: 1,
    justifyContent: "center",
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  quizSubtitle: {
    fontSize: 18,
    color: "#79818D",
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationContainer: {
    position: "absolute",
    top: 40,
    right: -7,
  },
  lockIconContainer: {
    position: "absolute",
    bottom: -10,
    left: -10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  blurContainer: {
    flex: 1,
    overflow: "hidden",
    paddingLeft: 8,
    paddingVertical: 4,
  },
  absoluteFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})

export default QuizItemComponent
