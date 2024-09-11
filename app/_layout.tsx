import React, { useEffect, useRef, useState } from "react"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import "react-native-reanimated"
import { View, Button, Text, AppState, StyleSheet } from "react-native"
import * as Updates from "expo-updates"

import { useColorScheme } from "@/hooks/useColorScheme"
import App from "./(tabs)"
import NavBar from "./NavBar"
import { UserProvider } from "@/contexts/UserContext"

SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  const appState = useRef(AppState.currentState)
  const [update, setUpdate] = useState<Updates.UpdateCheckResult | null>(null)
  const [updateString, setUpdateString] = useState("")

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useEffect(() => {
    setUpdateString("Adding subscription")
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        setUpdateString(updateString + "\nState is active")

        console.log("App has come to the foreground!")
        checkForUpdates()
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  async function checkForUpdates() {
    setUpdateString(updateString + "\nChecking for updates")

    try {
      const updateResult = await Updates.checkForUpdateAsync()
      setUpdateString(updateString + "\nFound update result")
      setUpdate(updateResult)
      if (updateResult.isAvailable) {
        setUpdateString(updateString + "\nUpdating")

        await Updates.fetchUpdateAsync()
        await Updates.reloadAsync()
      } else {
        setUpdateString(updateString + "\nNo update found")
      }
    } catch (error) {
      console.log(`Error checking for updates: ${error}`)
      setUpdateString(
        `${updateString}\nError checking for updates: ${JSON.stringify(error)}`
      )
    }
  }

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <App />

      <NavBar />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  debugButtonContainer: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 1000,
    opacity: 0,
  },
  fullPageView: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraView: {
    zIndex: 1,
  },
})

export default function ContextWrapper() {
  return (
    <UserProvider>
      <RootLayout />
    </UserProvider>
  )
}
