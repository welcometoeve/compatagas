import { Tabs } from "expo-router"
import React from "react"
import { View } from "react-native"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Ionicons, Entypo } from "@expo/vector-icons"

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="album"
        options={{
          title: "Album",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ paddingTop: 10 }}>
              <Entypo name="folder-images" size={25} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ paddingTop: 10 }}>
              <Ionicons name="camera" size={25} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  )
}
