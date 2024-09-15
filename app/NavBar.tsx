import React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { AntDesign, Ionicons, FontAwesome } from "@expo/vector-icons"
import NotificationDot from "@/components/results/NotificationDot"
import { useNotification } from "@/contexts/NotificationContext"
import { useUser } from "@/contexts/UserContext"

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
    name: "Quizzes",
    page: "quizzes",
    activeIcon: "document-text",
    inactiveIcon: "document-text-outline",
  },
  {
    name: "Questions",
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
  const numYourNotifications = notifications.filter(
    (notification) => notification.selfId === user?.id
  ).length

  const numTheirNotifications = notifications.filter(
    (notification) => notification.friendId === user?.id
  ).length

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tabItem}
          onPress={() => setPage(tab.page)}
        >
          <View style={styles.iconContainer}>
            {tab.name === "Questions" ? (
              <AntDesign
                name={
                  (page === tab.page
                    ? tab.activeIcon
                    : tab.inactiveIcon) as keyof typeof AntDesign.glyphMap
                }
                size={24}
                color={page === tab.page ? "white" : "#8E8E93"}
              />
            ) : tab.name === "Quizzes" ? (
              <Ionicons
                name={
                  (page === tab.page
                    ? tab.activeIcon
                    : tab.inactiveIcon) as keyof typeof Ionicons.glyphMap
                }
                size={28}
                color={page === tab.page ? "white" : "#8E8E93"}
              />
            ) : (
              <FontAwesome
                name={
                  (page === tab.page
                    ? tab.activeIcon
                    : tab.inactiveIcon) as keyof typeof FontAwesome.glyphMap
                }
                size={26}
                color={page === tab.page ? "white" : "#8E8E93"}
              />
            )}
            {tab.name === "Results" && (
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
              { color: page === tab.page ? "white" : "#8E8E93" },
            ]}
          >
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "black",
    paddingTop: 15,
    paddingBottom: 45,
  },
  tabItem: {
    alignItems: "center",
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
})

export default NavBar
