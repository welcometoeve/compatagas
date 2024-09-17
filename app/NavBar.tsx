import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons"
import NotificationDot from "@/components/results/NotificationDot"
import { useNotification } from "@/contexts/NotificationContext"
import { useUser } from "@/contexts/UserContext"
import collect from "@/components/collect"
import { RectangleStackIcon as RectangleStackIconOutline } from "react-native-heroicons/outline"
import { RectangleStackIcon as RectangleStackIconSolid } from "react-native-heroicons/solid"

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
  page: string
}

const tabs: TabItem[] = [
  {
    name: "Question Packs",
    page: "quizzes",
    activeIcon: "document-text",
    inactiveIcon: "document-text-outline",
  },
  {
    name: "Question Stack",
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
]

interface NavBarProps {
  page: string
  setPage: (page: string) => void
}

const NavBar: React.FC<NavBarProps> = ({ page, setPage }: NavBarProps) => {
  const { notifications } = useNotification()
  const { user } = useUser()
  const numYourNotifications = collect(
    notifications.filter(
      (notification) =>
        notification.selfId === user?.id && notification.selfOpened === false
    ),
    ["quizId"]
  ).length

  const numTheirNotifications = notifications.filter(
    (notification) =>
      notification.friendId === user?.id && notification.friendOpened === false
  ).length

  return (
    <View style={[styles.container]}>
      <View style={[styles.tabContainer]}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.name}
            style={[
              styles.tabItem,
              index === 0 && styles.leftTabItem,
              index === 1 && styles.centerTabItem,
              index === 2 && styles.rightTabItem,
              {
                paddingTop:
                  tab.page === "results"
                    ? 2
                    : tab.page === "questions"
                    ? 17
                    : 5,
              },
            ]}
            onPress={() => setPage(tab.page)}
          >
            <View
              style={[
                styles.iconContainer,
                { marginTop: tab.page === "results" ? -15 : 0 },
              ]}
            >
              {tab.page === "questions" ? (
                <View style={styles.flippedIcon}>
                  {page === tab.page ? (
                    <RectangleStackIconSolid color={"#007AFF"} size={28} />
                  ) : (
                    <RectangleStackIconOutline color={"#8E8E93"} size={28} />
                  )}
                </View>
              ) : tab.page === "quizzes" ? (
                <Ionicons
                  name={
                    (page === tab.page
                      ? tab.activeIcon
                      : tab.inactiveIcon) as keyof typeof Ionicons.glyphMap
                  }
                  size={28}
                  color={page === tab.page ? "#007AFF" : "#8E8E93"}
                />
              ) : (
                <FontAwesome
                  name={
                    (page === tab.page
                      ? tab.activeIcon
                      : tab.inactiveIcon) as keyof typeof FontAwesome.glyphMap
                  }
                  size={26}
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
    backgroundColor: "rgba(255, 255, 255)",
    paddingTop: 25,
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
    top: -9,
    left: -20,
  },
  flippedIcon: {
    transform: [{ rotate: "180deg" }],
  },
})

export default NavBar
