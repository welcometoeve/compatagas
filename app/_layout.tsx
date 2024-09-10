import React, { useEffect, useRef, useState } from "react"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import "react-native-reanimated"
import { View, Button, AppState, StyleSheet } from "react-native"
import * as Updates from "expo-updates"

import { useColorScheme } from "@/hooks/useColorScheme"
import App from "./(tabs)"
import NavBar from "./NavBar"
import { UserProvider, useUser } from "@/contexts/UserContext"
import AccountScreen from "./(tabs)/login"
import { DebugView } from "./(tabs)/DebugView"
import { FriendsProvider, useFriends } from "@/contexts/FriendsContext"
import { AnswerProvider, useAnswers } from "@/contexts/AnswerContext"
import ErrorModal from "@/components/ErrorModal"

SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  const appState = useRef(AppState.currentState)
  const [isDebugVisible, setIsDebugVisible] = useState<boolean>(false)
  const [update, setUpdate] = useState<Updates.UpdateCheckResult | null>(null)
  const [updateString, setUpdateString] = useState<string>("")
  const { user, authenticating, signingUp } = useUser()
  const { refreshFriends, error: friendsError, friends } = useFriends()
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false)
  const { fetchError: fetchAnswersError, fetchAnswers } = useAnswers()
  const [errorMessage, setErrorMessage] = useState<string>("")

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

  useEffect(() => {
    if (user && !authenticating && !signingUp) {
      refreshFriends()
    }
  }, [user, authenticating, signingUp])

  useEffect(() => {
    if (friendsError || fetchAnswersError) {
      setErrorMessage(friendsError || fetchAnswersError || "An error occurred")
      setIsErrorModalVisible(true)
    }
  }, [friendsError, fetchAnswersError])

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

  const handleErrorModalClose = () => {
    setIsErrorModalVisible(false)
    refreshFriends()
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

        <View style={[styles.fullPageView, styles.cameraView]}>
          {friends.length > 0 && <App />}
        </View>
        <DebugView
          isVisible={isDebugVisible}
          onClose={() => setIsDebugVisible(false)}
          update={update}
          updateString={updateString}
        />
        <ErrorModal
          visible={isErrorModalVisible}
          message={errorMessage}
          onClose={handleErrorModalClose}
          retry={fetchAnswersError ? fetchAnswers : refreshFriends}
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
      <FriendsProvider>
        <AnswerProvider>
          <RootLayout />
        </AnswerProvider>
      </FriendsProvider>
    </UserProvider>
  )
}
