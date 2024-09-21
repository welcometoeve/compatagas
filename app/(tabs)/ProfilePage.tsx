import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useUser } from "@/contexts/UserContext"
import EmojiSelector from "react-native-emoji-selector"

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
}

const CustomCheckbox: React.FC<{ checked: boolean; onPress: () => void }> = ({
  checked,
  onPress,
}) => (
  <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
    <View style={[styles.checkbox, checked && styles.checked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  </TouchableOpacity>
)

const ProfilePage: React.FC = () => {
  const { user, createUser } = useUser()

  const [friends, setFriends] = useState<Friend[]>([
    { id: "1", name: "Jane Doe", emoji: "👩", isFriend: true },
    { id: "2", name: "James Doe", emoji: "👨", isFriend: true },
    { id: "3", name: "Jill Doe", emoji: "👧", isFriend: false },
    // ... (rest of the friends array)
  ])
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState(user?.emoji ?? "👧")

  const toggleFriendStatus = (id: string) => {
    setFriends(
      friends.map((friend) =>
        friend.id === id ? { ...friend, isFriend: !friend.isFriend } : friend
      )
    )
  }

  const handleEditPress = () => {
    setIsEmojiPickerVisible(true)
  }

  const handleSelectEmoji = (emoji: string) => {
    setSelectedEmoji(emoji)
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
        </View>
        <View style={styles.friendsContainer}>
          <View style={styles.friendsTitleContainer}>
            <Text style={styles.friendsTitle}>Friends</Text>
            <Text style={styles.friendsSubtitle}>
              (check everyone you know)
            </Text>
          </View>
          {friends.map((item) => (
            <View key={item.id} style={styles.friendItem}>
              <Text style={styles.friendEmoji}>{item.emoji}</Text>
              <Text style={styles.friendName}>{item.name}</Text>
              <CustomCheckbox
                checked={item.isFriend}
                onPress={() => toggleFriendStatus(item.id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        visible={isEmojiPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEmojiPickerVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => {
              user &&
                createUser(
                  user.phoneNumber,
                  user.name ?? "",
                  user.lastName ?? "",
                  selectedEmoji
                )
              setIsEmojiPickerVisible(false)
            }}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
          <View style={styles.emojiPickerContainer}>
            <EmojiSelector
              onEmojiSelected={handleSelectEmoji}
              showSearchBar={true}
              showHistory={false}
              showSectionTitles={false}
              showTabs={false}
              columns={6}
              category={undefined}
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    paddingTop: 15,
    color: "gray",
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
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  friendEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  friendName: {
    fontSize: 19,
    flex: 1,
  },
  checkboxContainer: {
    padding: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  emojiPickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    height: 300,
    overflow: "hidden",
    marginTop: 220,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 160,
    right: "5%",
    zIndex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
})

export default ProfilePage
