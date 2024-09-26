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
import QuestionResultView from "@/components/results/QuestionResultView"
import { Question } from "@/constants/questions/types"

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

  const { yourQuizzes } = useMemo(
    () =>
      currentUser
        ? processQuizLists(
            friendAnswers,
            selfAnswers,
            quizzes,
            questions,
            currentUser?.id
          )
        : { yourQuizzes: [], theirQuizzes: [] },
    [selfAnswers, friendAnswers, quizzes, currentUser]
  )

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
          {/* <Text style={styles.phoneNumber}>{currentUser?.phoneNumber}</Text> */}
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
              Answers ({yourQuizzes.length})
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

function QuestionsList({ userId }: { userId: number }) {
  const { user } = useUser()
  const isYou = userId === user?.id
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const relevantSelfAnswers = selfAnswers.filter((sa) => sa.userId === userId)
  const faGroups = collect(friendAnswers, ["questionId", "selfId"])

  const groups: {
    selfAnswer: SelfAnswer
    friendAnswers: FriendAnswer[]
    question: Question | undefined
  }[] = relevantSelfAnswers.map((sa) => {
    const friendAnswers = faGroups.find(
      (group) =>
        group.length > 0 &&
        group[0].questionId === sa.questionId &&
        group[0].selfId === sa.userId
    )

    const question = questions.find((q) => q.id === sa.quizId)
    return { selfAnswer: sa, friendAnswers: friendAnswers ?? [], question }
  })

  const usableGroups = groups.filter(
    (g) => g.friendAnswers.length > 0 && !!g.question
  )
  return usableGroups.length === 0 ? (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsText}>Results list is empty</Text>
    </View>
  ) : (
    usableGroups.map((g, i) => (
      <QuestionResultView
        selfAnswer={g.selfAnswer}
        friendAnswers={g.friendAnswers}
        quizType={isYou ? "your" : "their"}
        question={g.question!}
        index={i}
      />
    ))
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
  phoneNumber: {
    fontSize: 18,
    marginBottom: 10,
    paddingTop: 15,
    color: "gray",
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
  resultsContainer: {
    width: "100%",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsText: {
    fontSize: 18,
    color: "gray",
  },
})

export default ProfilePage
