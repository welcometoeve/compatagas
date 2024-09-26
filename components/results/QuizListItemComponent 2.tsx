import React from "react"
import { useNotification } from "@/contexts/notification/NotificationContext"
import { QuizItem } from "./proccessQuizLists"
import * as Haptics from "expo-haptics"
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native"
import { BlurView } from "expo-blur"
import NotificationDot from "./NotificationDot"
import { ChevronRight } from "lucide-react-native"
import { LockClosedIcon } from "react-native-heroicons/outline"
import { User } from "@supabase/supabase-js"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { useFriends } from "@/contexts/FriendsContext"
import { usePage } from "@/contexts/PageContext"
import { quizzes } from "@/constants/questions/questions"

interface QuizItemComponentProps {
  quizId: number
  userId: number
  friendIds: number[]
  isLast: boolean
}

const QuizItemComponent: React.FC<QuizItemComponentProps> = ({
  quizId,
  userId,
  friendIds,
  isLast,
}) => {
  const { notifications, markAsOpened } = useNotification()
  const { user } = useUser()
  const { getFriends } = useFriends()
  const { pushPage } = usePage()

  const friends = getFriends(userId)
  const names = friendIds
    .map((id) => friends.find((user) => user?.id === id)?.name)
    .join(", ")
  const renderSubtitle = () => {
    const prefix = "Taken by"

    return (
      <View style={styles.subtitleContainer}>
        <Text style={styles.quizSubtitle}>{`${prefix} ${names}`}</Text>
      </View>
    )
  }

  const quiz = quizzes.find((quiz) => quiz.id === quizId)

  return (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={async () => {
        pushPage({ type: "quizResult", quizId, userId, friendIds })
      }}
    >
      <View style={styles.imageContainer}>
        {quiz && <Image source={quiz.src} style={styles.quizImage} />}
      </View>

      <View
        style={[styles.contentContainer, { borderBottomWidth: isLast ? 0 : 1 }]}
      >
        <View style={styles.quizInfo}>
          <Text style={styles.quizTitle}>{quiz?.name}</Text>
          {(names?.length ?? 0) > 0 && renderSubtitle()}
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
    fontSize: 16,
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
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
