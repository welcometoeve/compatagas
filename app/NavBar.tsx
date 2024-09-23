import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
import NotificationDot from "@/components/results/NotificationDot"
import { useNotification } from "@/contexts/notification/NotificationContext"
import { useUser } from "@/contexts/UserContext"
import collect from "@/components/collect"
import { HomeIcon as HomeIconOutline } from "react-native-heroicons/outline"
import { HomeIcon as HomeIconSolid } from "react-native-heroicons/solid"
import { Page, usePage } from "@/contexts/PageContext"

interface TabItem {
  name: string
  page: Page
  icon: (props: { color: string; size: number }) => React.ReactNode
}

const tabs: TabItem[] = [
  {
    name: "Packs",
    page: "quizzes",
    icon: ({ color, size }) => (
      <Ionicons
        name={color === "#007AFF" ? "document-text" : "document-text-outline"}
        size={size}
        color={color}
      />
    ),
  },
  {
    name: "Home",
    page: "questions",
    icon: ({ color, size }) =>
      color === "#007AFF" ? (
        <HomeIconSolid color={color} size={size} />
      ) : (
        <HomeIconSolid color={color} size={size} />
      ),
  },
  {
    name: "You",
    page: "profile",
    icon: ({ color, size }) => (
      <Ionicons
        name={
          color === "#007AFF" ? "person-circle-sharp" : "person-circle-outline"
        }
        size={size + 2}
        color={color}
      />
    ),
  },
]

const NavBar: React.FC = () => {
  const { notifications } = useNotification()
  const { user } = useUser()
  const numYourNotifications = collect(
    notifications.filter(
      (notification) =>
        notification.selfId === user?.id && notification.selfOpened === false
    ),
    ["quizId"]
  ).length
  const { page, setPage, setCurQuizResultItem, setCurquizId } = usePage()

  const numTheirNotifications = notifications.filter(
    (notification) =>
      notification.friendId === user?.id && notification.friendOpened === false
  ).length

  return (
    <View style={[styles.container]}>
      <View style={[styles.tabContainer]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabItem, { flex: 1 }]}
            onPress={() => {
              setPage(tab.page)
              setCurQuizResultItem(null)
              setCurquizId(null)
            }}
          >
            <View style={styles.iconContainer}>
              {tab.icon({
                color: page === tab.page ? "#007AFF" : "#8E8E93",
                size: 28,
              })}
              {tab.page === "results" && (
                <View style={styles.notificationDotContainer}>
                  <NotificationDot
                    count={numTheirNotifications + numYourNotifications}
                  />
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  color: page === tab.page ? "#007AFF" : "#8E8E93",
                  width: 80,
                  textAlign: "center",
                },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgb(240, 240, 240)",
    paddingTop: 10,
    paddingBottom: 45,
    borderTopColor: "#E0E0E0",
    borderTopWidth: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    height: 50,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  leftTabItem: {
    position: "absolute",
    left: 20,
  },
  centerTabItem: {
    // Center tab doesn't need additional styling
  },
  rightTabItem: {
    position: "absolute",
    right: 20,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
  iconContainer: {
    position: "relative",
  },
  notificationDotContainer: {
    position: "absolute",
    top: -10,
    right: -7,
  },
  flippedIcon: {
    transform: [{ rotate: "180deg" }],
  },
  lemonCounter: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
  },
  pinkCircle: {
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgb(180, 180, 180)",
    borderWidth: 1,
  },
  lemonEmoji: {
    fontSize: 24,
  },
  lemonCount: {
    fontSize: 14,
    marginTop: 0,
    color: "black",
    fontWeight: "bold",
  },
})

export default NavBar
