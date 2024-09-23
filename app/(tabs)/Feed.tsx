import React from "react"
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native"
import { getFeedQuizzes } from "@/components/results/proccessQuizLists"
import { questions, quizzes } from "@/constants/questions/questions"
import { Quiz } from "@/constants/questions/types"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useFriends } from "@/contexts/FriendsContext"
import { usePage } from "@/contexts/PageContext"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { UserProfile, useUser } from "@/contexts/UserContext"

const screenWidth = Dimensions.get("window").width

type QuizFeedItemProps = {
  quizId: number
  selfId: number
  friendIds: number[]
}

const PastelCircleAvatar: React.FC<{ name: string; size?: number }> = ({
  name,
  size = 40,
}) => {
  const getColorFromName = (name: string) => {
    const hue = name.charCodeAt(0) % 360
    return `hsl(${hue}, 70%, 80%)`
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: getColorFromName(name),
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
      }}
    >
      <Text style={{ fontSize: size * 0.45, fontWeight: "bold" }}>
        {name.charAt(0).toUpperCase()}
      </Text>
    </View>
  )
}

const QuizFeedItem: React.FC<QuizFeedItemProps> = ({
  quizId,
  selfId,
  friendIds,
}) => {
  const { user } = useUser()
  const { allUsers } = useFriends()
  const selfUser = allUsers.find((u) => u.id === selfId)
  const quiz = quizzes.find((q) => q.id === quizId)
  const otherTakers = friendIds.map((id) => allUsers.find((u) => u.id === id))
  const { pushPage } = usePage()

  return (
    <View style={styles.itemContainer}>
      <View style={styles.quizImageContainer}>
        {quiz && <Image source={quiz.src} style={styles.quizImage} />}
        <View style={styles.quizOverlay}>
          <View style={styles.overlayContent}>
            <PastelCircleAvatar name={selfUser?.name ?? ""} size={30} />
            <View style={styles.overlayTextContainer}>
              <Text style={styles.quizOverlayText}>
                {selfUser?.name} took {quiz?.name}
              </Text>
              {otherTakers.length > 0 && (
                <Text style={styles.otherTakersText}>
                  {otherTakers.map((user) => user?.name).join(", ")} took this
                  quiz about them
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={styles.takeQuizButton}
            onPress={() =>
              pushPage({
                type: "takeQuiz",
                quizId: quizId,
                userId: selfId,
              })
            }
          >
            <Text style={styles.takeQuizButtonText}>
              Take Quiz about {selfUser?.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const QuizFeed: React.FC = () => {
  const { friendAnswers } = useFriendAnswers()
  const { selfAnswers } = useSelfAnswers()
  const { user } = useUser()
  const { getFriends } = useFriends()

  const friends = getFriends(user?.id ?? 0)
  const feedQuizzes = getFeedQuizzes(
    friendAnswers,
    selfAnswers,
    quizzes,
    questions,
    user?.id ?? 0,
    friends.map((f) => f.id)
  )

  if (feedQuizzes.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No packs to take for your friends now. Add more friends or wait for
          your friends to fill out more packs.
        </Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={feedQuizzes}
        keyExtractor={(item) => `${item.quizId}-${item.selfId}`}
        renderItem={({ item }) => (
          <QuizFeedItem
            quizId={item.quizId}
            selfId={item.selfId}
            friendIds={item.friendIds}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 32,
  },
  quizImageContainer: {
    position: "relative",
  },
  quizImage: {
    width: screenWidth - 32,
    height: screenWidth - 32,
    resizeMode: "cover",
    borderRadius: 8,
  },
  quizOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
  },
  overlayContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  overlayTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  quizOverlayText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  otherTakersText: {
    color: "white",
    fontSize: 14,
    marginTop: 4,
  },
  takeQuizButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  takeQuizButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
})

export default QuizFeed
