import { useFriends } from "@/contexts/FriendsContext"
import { UserProfile } from "@/contexts/UserContext"
import React, { useState } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native"

interface FriendListItemProps {
  friend: UserProfile
}

export default function FriendListItem({ friend }: FriendListItemProps) {
  const { friends, allUsers, addFriendRelationship, removeFriendRelationship } =
    useFriends()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isFriend = friends.some((f) => f.id === friend.id)

  const handleToggleFriend = () => {
    setLoading(true)
    const action = isFriend ? removeFriendRelationship : addFriendRelationship
    action(friend.id)
      .then(() => setLoading(false))
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }

  return (
    <View key={friend.id} style={styles.friendItem}>
      <Text style={styles.friendEmoji}>{friend.emoji}</Text>
      <Text style={styles.friendName}>{`${friend.name} ${
        friend.lastName ?? ""
      }`}</Text>
      <View style={styles.checkboxContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#007AFF"
            style={styles.loader}
          />
        ) : (
          <CustomCheckbox checked={isFriend} onPress={handleToggleFriend} />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

export const CustomCheckbox: React.FC<{
  checked: boolean
  onPress: () => void
}> = ({ checked, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.checkbox}>
    <View style={[styles.checkboxInner, checked && styles.checked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
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
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxInner: {
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
  loader: {
    width: 24,
    height: 24,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 10,
  },
})
