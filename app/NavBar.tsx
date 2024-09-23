import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNotification } from "@/contexts/notification/NotificationContext"
import { useUser } from "@/contexts/UserContext"
import collect from "@/components/collect"
import { HomeIcon as HomeIconSolid } from "react-native-heroicons/solid"
import { PageEnum, PageStackItem, usePage } from "@/contexts/PageContext"

interface TabItem {
  name: string
  icon: (props: { color: string; size: number }) => React.ReactNode
  pageStackItem: PageStackItem
}

const NavBar: React.FC = () => {
  const { notifications } = useNotification()
  const { user } = useUser()
  const { pageStack, pushPage, popPage, resetStack } = usePage()
  const tabs = getTabs(user?.id ?? 0)
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
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabItem, { flex: 1 }]}
            onPress={() => {
              resetStack(tab.pageStackItem)
            }}
          >
            <View style={styles.iconContainer}>
              {tab.icon({
                color:
                  pageStack[0]?.type === tab.pageStackItem.type
                    ? "#007AFF"
                    : "#8E8E93",
                size: 28,
              })}
            </View>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    pageStack[0]?.type === tab.pageStackItem.type
                      ? "#007AFF"
                      : "#8E8E93",
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

const getTabs = (userId: number): TabItem[] => {
  return [
    {
      name: "Packs",
      icon: ({ color, size }) => (
        <Ionicons
          name={color === "#007AFF" ? "document-text" : "document-text-outline"}
          size={size}
          color={color}
        />
      ),
      pageStackItem: {
        type: "newPacks",
      },
    },
    {
      name: "Home",
      icon: ({ color, size }) =>
        color === "#007AFF" ? (
          <HomeIconSolid color={color} size={size} />
        ) : (
          <HomeIconSolid color={color} size={size} />
        ),
      pageStackItem: {
        type: "feed",
      },
    },
    {
      name: "You",
      icon: ({ color, size }) => (
        <Ionicons
          name={
            color === "#007AFF"
              ? "person-circle-sharp"
              : "person-circle-outline"
          }
          size={size + 2}
          color={color}
        />
      ),
      pageStackItem: {
        type: "profile",
        userId: userId ?? 0,
      },
    },
  ]
}
