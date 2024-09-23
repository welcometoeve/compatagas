import { useFriends } from "@/contexts/FriendsContext"
import { usePage } from "@/contexts/PageContext"
import { UserProfile, useUser } from "@/contexts/UserContext"
import React, { useState, useMemo } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native"

interface FriendListItemProps {
  friend: UserProfile
  userId: number
}

const niceColors = [
  "#FFB3BA", // Light Pink
  "#BAFFC9", // Light Green
  "#BAE1FF", // Light Blue
  "#FFFFBA", // Light Yellow
  "#FFD700", // Gold
  "#E6E6FA", // Lavender
  "#98FB98", // Pale Green
  "#DDA0DD", // Plum
  "#B0E0E6", // Powder Blue
  "#F0E68C", // Khaki
  "#FFA07A", // Light Salmon
  "#20B2AA", // Light Sea Green
  "#87CEFA", // Light Sky Blue
  "#778899", // Light Slate Gray
  "#B0C4DE", // Light Steel Blue
  "#FAFAD2", // Light Goldenrod Yellow
  "#D3D3D3", // Light Gray
  "#90EE90", // Light Green
  "#FFB6C1", // Light Pink
  "#FFA500", // Orange
]

const getColorForFriend = (friendId: number) => {
  const colorIndex = friendId % niceColors.length
  return niceColors[colorIndex]
}

export default function FriendListItem({
  friend,
  userId,
}: FriendListItemProps) {
  const { addFriendRelationship, removeFriendRelationship } = useFriends()
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getFriends } = useFriends()
  const { pushPage, pageStack } = usePage()

  const friends = getFriends(userId)
  const isFriend = friends.some((f) => f.id === friend.id)

  const avatarColor = useMemo(() => getColorForFriend(friend.id), [friend.id])
  const isThisUser = user?.id === userId

  const handleToggleFriend = () => {
    setLoading(true)
    const action = isFriend ? removeFriendRelationship : addFriendRelationship
    action(userId, friend.id)
      .then(() => setLoading(false))
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }

  return (
    <View style={styles.friendItem}>
      <TouchableOpacity
        style={styles.friendContent}
        onPress={() => {
          pushPage({ type: "profile", userId: friend.id })
        }}
      >
        <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>
            {(friend.name ?? "")[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.friendName}>{`${friend.name} ${
          friend.lastName ?? ""
        }`}</Text>
      </TouchableOpacity>
      {isThisUser && (
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
      )}
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
  friendContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 20,
    color: "#333333",
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
