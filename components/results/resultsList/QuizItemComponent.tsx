import { useNotification } from "@/contexts/notification/NotificationContext"
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
      </View>

      <View style={styles.contentContainer}>
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
    height: 120, // Fixed height for consistent sizing
  },
  imageContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  quizImage: {
    width: 90,
    height: 90,
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
})

export default QuizItemComponent
