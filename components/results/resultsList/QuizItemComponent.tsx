import { useNotification } from "@/contexts/NotificationContext"
import { QuizItem } from "../proccessQuizLists"
import * as Haptics from "expo-haptics"
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import NotificationDot from "../NotificationDot"
import { ChevronRight } from "lucide-react-native"

interface QuizItemComponentProps {
  item: QuizItem
  setQuizItem: (item: QuizItem) => void
  activeTab: "your" | "their"
  allUsers: any[] // Replace 'any' with the correct type for users
  user: any // Replace 'any' with the correct type for user
}

const QuizItemComponent: React.FC<QuizItemComponentProps> = ({
  item,
  setQuizItem,
  activeTab,
  allUsers,
  user,
}) => {
  const { notifications, markAsOpened } = useNotification()

  const relevantNs = notifications.filter(
    (n) =>
      (activeTab === "your" &&
        n.selfOpened === false &&
        n.selfId === user?.id &&
        item.friendIds.includes(n.friendId)) ||
      (activeTab === "their" &&
        n.friendOpened === false &&
        n.friendId === user?.id &&
        n.selfId === item.selfId)
  )

  const triggerHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch (error) {
      console.error("Failed to trigger haptic:", error)
    }
  }

  return (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={async () => {
        setQuizItem(item)
        relevantNs.forEach((notification) =>
          markAsOpened(notification, activeTab === "your")
        )
        relevantNs.length > 0 && (await triggerHaptic())
      }}
    >
      <View style={styles.notificationContainer}>
        {relevantNs.length > 0 && (
          <NotificationDot count={1} showCount={false} />
        )}
      </View>
      <Image source={item.quiz.src} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.quiz.name}</Text>
        <Text style={styles.quizSubtitle}>
          {activeTab === "your"
            ? `Taken by ${item.friendIds
                .map((id) => allUsers.find((user) => user?.id === id)?.name)
                .join(", ")}`
            : `Taken for ${
                allUsers.find((user) => user?.id === item.selfId)?.name
              }`}
        </Text>
      </View>
      <ChevronRight color="#fff" size={24} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  quizItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#3C444F",
    height: 100,
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
    borderRadius: 5,
  },
  quizInfo: {
    flex: 1,
    justifyContent: "center",
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  quizSubtitle: {
    fontSize: 14,
    color: "#79818D",
  },
})

export default QuizItemComponent
