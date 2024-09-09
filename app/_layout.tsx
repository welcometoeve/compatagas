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
import { AlbumProvider } from "@/contexts/AlbumContext"
import App from "./(tabs)"
import Album from "./(tabs)/album"
import { DebugView } from "./(tabs)/DebugView"
import { PageProvider, usePage } from "@/contexts/PageContext"
import NavBar from "./NavBar"
import Albums from "./(tabs)/Albums"
import { UserProvider, useUser } from "@/contexts/UserContext"
import AccountScreen from "./(tabs)/login"
import { PhotoProvider } from "@/contexts/photo/PhotoContext"

SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  const appState = useRef(AppState.currentState)
  const [isDebugVisible, setIsDebugVisible] = useState(false)
  const [update, setUpdate] = useState<Updates.UpdateCheckResult | null>(null)
  const { page } = usePage()
  const [updateString, setUpdateString] = useState("")
  const { user, authenticating, signingIn } = useUser()

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

  if (!authenticating && !user) {
    return <AccountScreen />
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <View style={styles.debugButtonContainer}>
          <Button title="Debug" onPress={() => setIsDebugVisible(true)} />
        </View>

        {page === "albums" ? (
          <View style={[styles.fullPageView, styles.cameraView]}>
            <Albums />
          </View>
        ) : page === "album" ? (
          <View style={styles.fullPageView}>
            <Album />
          </View>
        ) : (
          <View style={[styles.fullPageView, styles.cameraView]}>
            <App />
          </View>
        )}
        <DebugView
          isVisible={isDebugVisible}
          onClose={() => setIsDebugVisible(false)}
          update={update}
          updateString={updateString}
        />
      </View>
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
      <PageProvider>
        <AlbumProvider>
          <PhotoProvider>
            <RootLayout />
          </PhotoProvider>
        </AlbumProvider>
      </PageProvider>
    </UserProvider>
  )
}
