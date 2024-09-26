import React, { useState, useRef, useMemo, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { useFriends } from "@/contexts/FriendsContext"
import FriendListItem from "@/components/profile/FriendListItem"
import Tooltip from "@/components/profile/CustomTooltip"
import * as ImagePicker from "expo-image-picker"
import processQuizLists, {
  QuizItem,
} from "@/components/results/proccessQuizLists"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { questions, quizzes } from "@/constants/questions/questions"
import QuizResultsView from "@/components/results/QuizResultView"
import { ChevronLeft } from "lucide-react-native"
import { usePage } from "@/contexts/PageContext"
import { SafeAreaView } from "react-native-safe-area-context"
import QuizItemComponent from "@/components/results/QuizListItemComponent"
import collect from "@/components/collect"
import QuestionResultView, {
  GREEN,
  RED,
} from "@/components/results/QuestionResultView"
import { Question } from "@/constants/questions/types"
import QuestionsList, {
  useQuestionResults,
} from "@/components/profile/AnsweredQuestionsList"

function useHitScore(userId: number) {
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()

  const relevantFriendAnswers = friendAnswers.filter(
    (fa) => fa.friendId === userId
  )
  const relevantSelfAnswers = selfAnswers.filter((sa) =>
    relevantFriendAnswers.some(
      (fa) => fa.questionId === sa.questionId && fa.selfId === sa.userId
    )
  )

  return relevantFriendAnswers.filter((fa) => {
    const selfAnswer = relevantSelfAnswers.find(
      (sa) => sa.questionId === fa.questionId && sa.userId === fa.friendId
    )
    return selfAnswer?.optionIndex === fa.optionIndex
  }).length
}

interface ProfilePageProps {
  userId: number
}

const ProfilePage: React.FC<ProfilePageProps> = ({
  userId,
}: ProfilePageProps) => {
  const { allUsers } = useFriends()
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"results" | "friends">("results")
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const { popPage, pageStack } = usePage()

  const hitScore = useHitScore(userId)

  const answeredQuestions = useQuestionResults(userId)

  const { user, createUser } = useUser()
  const currentUser = allUsers.find((u) => u.id === userId)
  const handleEditPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
      currentUser &&
        createUser(
          currentUser.phoneNumber,
          currentUser.name ?? "",
          currentUser.lastName ?? "",
          result.assets[0].uri
        )
    }
  }

  const isThisUser = currentUser?.id == user?.id

  const friendCount = allUsers.filter((u) => u.id !== currentUser?.id).length

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />

      <View style={{ zIndex: 1 }}>
        {pageStack.length > 1 && (
          <TouchableOpacity
            onPress={() => {
              setActiveTab("friends")
              popPage()
            }}
            style={styles.backButton}
          >
            <ChevronLeft size={32} color="#000000" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {currentUser?.name?.[0] ?? "U"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleEditPress}
              style={styles.editButton}
            >
              {isThisUser && <Text style={styles.editButtonText}>Edit</Text>}
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{`${currentUser?.name} ${
            currentUser?.lastName ?? ""
          }`}</Text>
          <View
            style={[
              styles.hitScoreContainer,
              { backgroundColor: hitScore < 1 ? RED : GREEN },
            ]}
          >
            <Text style={styles.hitScoreText}>Hit Score: </Text>
            <Text style={styles.hitScoreValue}>{hitScore} 🎯</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "results" && styles.activeTab]}
            onPress={() => setActiveTab("results")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "results" && styles.activeTabText,
              ]}
            >
              Questions ({answeredQuestions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "friends" && styles.activeTab]}
            onPress={() => setActiveTab("friends")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "friends" && styles.activeTabText,
              ]}
            >
              Friends ({friendCount})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "results" ? (
          <QuestionsList userId={userId} />
        ) : (
          <View style={styles.friendsContainer}>
            <View style={styles.friendsTitleContainer}>
              {isThisUser && (
                <Text
                  style={styles.friendsSubtitle}
                >{`(check everyone you know)`}</Text>
              )}
            </View>
            {allUsers
              .filter((u) => u.id !== currentUser?.id)
              .map((item) => (
                <FriendListItem
                  friend={item}
                  key={item.id}
                  userId={userId}
                  setActiveTab={setActiveTab}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    height: 44,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 10,
    top: 20,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 25,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 75,
    backgroundColor: "#E1E1E1",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 60,
    color: "#757575",
  },
  editButton: {
    zIndex: 1,
    paddingTop: 20,
  },
  editButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  name: {
    fontSize: 40,
    fontWeight: "bold",
  },
  hitScoreContainer: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: GREEN,
    borderRadius: 15,
    padding: 10,
    paddingHorizontal: 12,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    flexDirection: "row",
  },
  hitScoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  hitScoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#E1E1E1",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#757575",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  friendsContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  friendsTitleContainer: {
    flexDirection: "column",
    marginBottom: 20,
    width: "100%",
    paddingBottom: 10,
  },
  friendsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 1,
  },
  friendsSubtitle: {
    fontSize: 18,
    color: "gray",
    paddingTop: 12,
    textAlign: "center",
  },
})

export default ProfilePage
