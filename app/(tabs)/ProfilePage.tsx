import React, { useState, useRef, useMemo } from "react"
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
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { questions, quizzes } from "@/constants/questions/questions"
import QuizResultsView from "@/components/results/QuizResultView"
import QuizItemComponent from "@/components/results/resultsList/QuizItemComponent"

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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
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
          <Text style={styles.phoneNumber}>{currentUser?.phoneNumber}</Text>
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
              Packs
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
              Friends
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "results" ? (
          <>
            {yourQuizzes.length === 0 ? (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsText}>Results list is empty</Text>
              </View>
            ) : (
              yourQuizzes.map((quiz) => (
                <QuizItemComponent
                  quizId={quiz.quiz.id}
                  userId={quiz.selfId}
                  friendIds={quiz.friendIds}
                  key={quiz.quiz.id}
                />
              ))
            )}
          </>
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
                <FriendListItem friend={item} key={item.id} userId={userId} />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  scrollViewContent: {
    alignItems: "center",
    paddingTop: 20,
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
