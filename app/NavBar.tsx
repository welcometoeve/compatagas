import React, { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

interface TabItem {
  name: string
  activeIcon: keyof typeof Ionicons.glyphMap
  inactiveIcon: keyof typeof Ionicons.glyphMap
  page: string
}

const tabs: TabItem[] = [
  {
    name: "Your Results",
    activeIcon: "images",
    inactiveIcon: "image-outline",
    page: "albums",
  },
  {
    name: "Questions",
    activeIcon: "camera",
    inactiveIcon: "camera-outline",
    page: "camera",
  },
  {
    name: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
    page: "profile",
  },
]

const NavBar: React.FC = () => {
  // const { page, setPage } = usePage()
  const [page, setPage] = useState("camera")

  // const tabIsActive = (page: Page, tab: Page) => {
  //   if (
  //     (page === "album" || page === "albums") &&
  //     (tab === "album" || tab === "albums")
  //   ) {
  //     return true
  //   } else {
  //     return page === tab
  //   }
  // }

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tabItem}
          // onPress={() => setPage(tab.page)}
        >
          <Ionicons
            name={page === tab.page ? tab.activeIcon : tab.inactiveIcon}
            size={28}
            color={page === tab.page ? "white" : "#8E8E93"}
          />
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
    // borderTopWidth: 1,
    borderTopColor: "rgb(20, 20, 20)",
    paddingBottom: 45,
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
})

export default NavBar
