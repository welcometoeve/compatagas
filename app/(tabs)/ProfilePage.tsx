import React, { useState, useRef } from "react"
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

interface Friend {
  id: string
  name: string
  emoji: string
  isFriend: boolean
}

interface User {
  name: string
  lastName?: string
  phoneNumber: string
  profilePicture: string
  lemons?: number
}

const ProfilePage: React.FC = () => {
  const { user, createUser } = useUser()
  const { friends, allUsers, addFriendRelationship, removeFriendRelationship } =
    useFriends()

  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const lemonsRef = useRef<any>(null)
  const [activeTab, setActiveTab] = useState<"results" | "friends">("results")

  const handleEditPress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri)
      user &&
        createUser(
          user.phoneNumber,
          user.name ?? "",
          user.lastName ?? "",
          result.assets[0].uri
        )
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>
                  {user?.name?.[0] ?? "U"}
                </Text>
              </View>
            )}
            <TouchableOpacity
              onPress={handleEditPress}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{`${user?.name} ${
            user?.lastName ?? ""
          }`}</Text>
          <Text style={styles.phoneNumber}>{user?.phoneNumber}</Text>
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
              Results
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
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsText}>Results list is empty</Text>
          </View>
        ) : (
          <View style={styles.friendsContainer}>
            <View style={styles.friendsTitleContainer}>
              <Text
                style={styles.friendsSubtitle}
              >{`(check everyone you know)`}</Text>
            </View>
            {allUsers
              .filter((u) => u.id !== user?.id)
              .map((item) => (
                <FriendListItem friend={item} key={item.id} />
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
    marginBottom: 30,
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    width: 150,
    height: 150,
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
