import React from "react"
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native"
import { ChevronRight } from "lucide-react-native"
import { QuizItem } from "./proccessQuizLists"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { AntDesign, Ionicons } from "@expo/vector-icons"
import { usePage } from "@/contexts/PageContext"

interface QuizItemProps {
  item: QuizItem
  activeTab: "your" | "their"
  allUsers: UserProfile[]
  onPress: (item: QuizItem) => void
}

const QuizListItem: React.FC<QuizItemProps> = ({
  item,
  activeTab,
  allUsers,
  onPress,
}) => {
  const { setPage, setTakeCurQuizId } = usePage()
  const { user } = useUser()
  const getSubtitle = () => {
    if (activeTab === "your") {
      if (item.friendIds.length == 0) {
        return "Waiting for friends to take it. Share with them."
      } else if (!item.takenBySelf) {
        return `${item.friendIds
          .map((id) => allUsers.find((user) => user.id === id)?.name)
          .join(", ")} took it for you. Take it to see results.`
      } else {
        return `Taken by ${item.friendIds
          .map((id) => allUsers.find((user) => user.id === id)?.name)
          .join(", ")}. Results available!`
      }
    } else {
      if (item.takenBySelf) {
        return `Taken for ${
          allUsers.find((user) => user.id === item.selfId)?.name
        }. Results available!`
      } else {
        return `Waiting for ${
          allUsers.find((user) => user.id === item.selfId)?.name
        } to take it. Share with them.`
      }
    }
  }

  return (
    <TouchableOpacity
      style={styles.quizItem}
      onPress={() => onPress(item)}
      disabled={item.friendIds.length == 0 || !item.takenBySelf}
    >
      <Image
        source={item.quiz.src}
        style={[
          styles.quizImage,
          { opacity: item.friendIds.length > 0 && item.takenBySelf ? 1 : 0.75 },
        ]}
      />
      <View style={styles.quizInfo}>
        <Text
          style={[
            styles.quizTitle,
            {
              color:
                item.friendIds.length == 0 || !item.takenBySelf
                  ? "#aaa"
                  : "white",
            },
          ]}
        >
          {`${
            activeTab === "your"
              ? "Your"
              : allUsers.find((u) => u.id == item.selfId)?.name + "'s"
          } ${item.quiz.name}`}
        </Text>
        <Text style={styles.quizSubtitle}>{getSubtitle()}</Text>
      </View>
      {item.friendIds.length > 0 && item.takenBySelf ? (
        <ChevronRight color="#fff" size={26} />
      ) : activeTab === "your" && !item.takenBySelf ? (
        <TouchableOpacity
          style={styles.takeQuizButton}
          onPress={() => {
            setPage("quizzes")
            setTakeCurQuizId(item.quiz.id)
          }}
        >
          <Text style={styles.takeQuizText}>Take</Text>
          <Text style={styles.takeQuizText}>Quiz</Text>
        </TouchableOpacity>
      ) : (
        <Ionicons
          style={{ paddingLeft: 10 }}
          name="share-outline"
          color="#fff"
          size={26}
        />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  quizItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    height: 100,
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
    color: "#aaa",
  },
  takeQuizButton: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    marginLeft: 20,
  },
  takeQuizText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default QuizListItem
