import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { UserProfile, useUser } from "@/contexts/UserContext"
import { useFriends } from "@/contexts/FriendsContext"
import EmojiPicker from "@/components/profile/EmojiPicker"
import FriendListItem from "@/components/profile/FriendListItem"
import Tooltip from "@/components/profile/CustomTooltip"

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
  emoji: string
  lemons?: number
}

const ProfilePage: React.FC = () => {
  const { user, createUser } = useUser()
  const { friends, allUsers, addFriendRelationship, removeFriendRelationship } =
    useFriends()

  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState(user?.emoji ?? "👧")
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const lemonsRef = useRef<any>(null)

  const handleEditPress = () => {
    setIsEmojiPickerVisible(true)
  }

  const handleSelectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji)
  }

  const handleCloseEmojiPicker = () => {
    user &&
      createUser(
        user.phoneNumber,
        user.name ?? "",
        user.lastName ?? "",
        selectedEmoji
      )
    setIsEmojiPickerVisible(false)
  }

  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible)
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{selectedEmoji}</Text>
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

          <TouchableOpacity
            onPress={toggleTooltip}
            style={styles.lemonsButton}
            ref={lemonsRef}
          >
            <Text style={styles.lemonsText}>You Have: 🍋x3</Text>
            {/* <Info size={18} color="#FFFFFF" /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.friendsContainer}>
          <View style={styles.friendsTitleContainer}>
            <Text style={styles.friendsTitle}>Friends</Text>
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
      </ScrollView>
      <EmojiPicker
        isVisible={isEmojiPickerVisible}
        onClose={handleCloseEmojiPicker}
        onEmojiSelected={handleSelectEmoji}
        selectedEmoji={selectedEmoji}
      />
      <Tooltip
        isVisible={isTooltipVisible}
        content="Lemons are used to unlock who answered packs about you. You can earn lemons by answering questions in the stack."
        targetRef={lemonsRef}
      />
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
    marginBottom: 40,
    paddingTop: 25,
  },
  emojiContainer: {
    position: "relative",
    marginBottom: 30,
    alignItems: "center",
  },
  emoji: {
    fontSize: 100,
  },
  editButton: {
    position: "absolute",
    bottom: -20,
    zIndex: 1,
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
  lemonsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4457", // Pink color
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // marginBottom: 20,
    marginTop: 10,
  },
  lemonsText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginRight: 8,
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
  },
})

export default ProfilePage
