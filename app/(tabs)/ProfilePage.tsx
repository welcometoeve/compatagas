import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"

interface Friend {
  id: string
  name: string
  emoji: string
  isFriend: boolean
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
  const name = "John Doe"
  const emoji = "👨‍🦰"
  const phoneNumber = "555-555-5555"
  const [friends, setFriends] = React.useState<Friend[]>([
    { id: "1", name: "Jane Doe", emoji: "👩", isFriend: true },
    { id: "2", name: "James Doe", emoji: "👨", isFriend: true },
    { id: "3", name: "Jill Doe", emoji: "👧", isFriend: false },
    { id: "4", name: "Jane Doe", emoji: "👩", isFriend: true },
    { id: "5", name: "James Doe", emoji: "👨", isFriend: true },
    { id: "6", name: "Jill Doe", emoji: "👧", isFriend: false },
    { id: "7", name: "Jane Doe", emoji: "👩", isFriend: true },
    { id: "8", name: "James Doe", emoji: "👨", isFriend: true },
    { id: "9", name: "Jill Doe", emoji: "👧", isFriend: false },
    { id: "10", name: "Jane Doe", emoji: "👩", isFriend: true },
    { id: "11", name: "James Doe", emoji: "👨", isFriend: true },
    { id: "12", name: "Jill Doe", emoji: "👧", isFriend: false },
  ])

  const toggleFriendStatus = (id: string) => {
    setFriends(
      friends.map((friend) =>
        friend.id === id ? { ...friend, isFriend: !friend.isFriend } : friend
      )
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phoneNumber}>{phoneNumber}</Text>
        </View>
        <View style={styles.friendsContainer}>
          <Text style={styles.friendsTitle}>Friends</Text>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40, // Add some bottom padding for better scrolling
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
  },
  emojiContainer: {
    position: "relative",
    marginBottom: 10,
  },
  emoji: {
    fontSize: 100,
  },
  name: {
    fontSize: 48,
    fontWeight: "bold",
  },
  phoneNumber: {
    fontSize: 18,
    marginBottom: 20,
    paddingTop: 20,
    color: "gray",
  },
  friendsContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  friendsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
})

export default ProfilePage
