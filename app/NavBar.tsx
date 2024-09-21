import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons"
import NotificationDot from "@/components/results/NotificationDot"
import { useNotification } from "@/contexts/notification/NotificationContext"
import { useUser } from "@/contexts/UserContext"
import collect from "@/components/collect"
import { RectangleStackIcon as RectangleStackIconOutline } from "react-native-heroicons/outline"
import { RectangleStackIcon as RectangleStackIconSolid } from "react-native-heroicons/solid"
import { Page, usePage } from "@/contexts/PageContext"

interface TabItem {
  name: string
  activeIcon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof AntDesign.glyphMap
    | keyof typeof FontAwesome.glyphMap
  inactiveIcon:
    | keyof typeof Ionicons.glyphMap
    | keyof typeof AntDesign.glyphMap
    | keyof typeof FontAwesome.glyphMap
  page: Page
}

const tabs: TabItem[] = [
  {
    name: "Packs",
    page: "quizzes",
    activeIcon: "document-text",
    inactiveIcon: "document-text-outline",
  },
  {
    name: "Stack",
    page: "questions",
    activeIcon: "questioncircle",
    inactiveIcon: "questioncircleo",
  },
  {
    name: "Results",
    page: "results",
    activeIcon: "folder-open",
    inactiveIcon: "folder-open-o",
  },
  {
    name: "Profile",
    page: "profile",
    activeIcon: "person-circle-sharp",
    inactiveIcon: "person-circle-outline",
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
  const {
    page,
    setPage,
    setCurQuizResultItem,
    setActiveResultsTab,
    setCurquizId,
  } = usePage()

  const numTheirNotifications = notifications.filter(
    (notification) =>
      notification.friendId === user?.id && notification.friendOpened === false
  ).length

  // Hard-coded lemon count
  const lemonCount = 42

  return (
    <View style={[styles.container]}>
      <View style={[styles.tabContainer]}>
        {tabs.slice(0, 2).map((tab, index) => (
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
              {tab.page === "questions" ? (
                <View style={styles.flippedIcon}>
                  {page === tab.page ? (
                    <RectangleStackIconSolid color={"#007AFF"} size={28} />
                  ) : (
                    <RectangleStackIconOutline color={"#8E8E93"} size={28} />
                  )}
                </View>
              ) : (
                <Ionicons
                  name={
                    (page === tab.page
                      ? tab.activeIcon
                      : tab.inactiveIcon) as keyof typeof Ionicons.glyphMap
                  }
                  size={27}
                  color={page === tab.page ? "#007AFF" : "#8E8E93"}
                />
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

        {/* Lemon Counter with Pink Circle Backing */}
        <View style={[styles.tabItem, styles.lemonCounter, { flex: 1 }]}>
          <View style={styles.pinkCircle}>
            <Text style={styles.lemonEmoji}>🍋</Text>
            <Text style={styles.lemonCount}>x{user?.numLemons}</Text>
          </View>
        </View>

        {tabs.slice(2).map((tab, index) => (
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
              {tab.page === "results" ? (
                <FontAwesome
                  name={
                    (page === tab.page
                      ? tab.activeIcon
                      : tab.inactiveIcon) as keyof typeof FontAwesome.glyphMap
                  }
                  size={26}
                  color={page === tab.page ? "#007AFF" : "#8E8E93"}
                />
              ) : (
                <Ionicons
                  name={
                    (page === tab.page
                      ? tab.activeIcon
                      : tab.inactiveIcon) as keyof typeof Ionicons.glyphMap
                  }
                  size={29}
                  color={page === tab.page ? "#007AFF" : "#8E8E93"}
                />
              )}
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
    marginTop: 0, // Move the counter up to extend above the nav bar
  },
  pinkCircle: {
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 40, // Half of the width and height to create a circle
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
