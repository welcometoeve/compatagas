import React, { useEffect, useRef, useState } from "react"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import "react-native-reanimated"
import { View, Button, AppState, StyleSheet, Alert } from "react-native"
import * as Updates from "expo-updates"
import { StatusBar } from "expo-status-bar"

import { useColorScheme } from "@/hooks/useColorScheme"
import App from "./(tabs)"
import NavBar from "./NavBar"
import { UserProvider, useUser } from "@/contexts/UserContext"
import AccountScreen from "./(tabs)/login"
import { DebugView } from "./(tabs)/DebugView"
import {
  AnswerProvider,
  useFriendAnswers,
} from "@/contexts/FriendAnswerContext"
import ErrorModal from "@/components/ErrorModal"
import QuizzesView from "./(tabs)/QuizzesView"
import {
  SelfAnswerProvider,
  useSelfAnswers,
} from "@/contexts/SelfAnswerContext"
import { ResultsView } from "./(tabs)/ResultsView"
import { NotificationProvider } from "@/contexts/notification/NotificationContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { EnvironmentProvider } from "@/contexts/EnvironmentContext"
import { PageProvider, usePage } from "@/contexts/PageContext"

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
  const {
    user,
    authenticating,
    signingUp,
    requestNotificationPermission,
    allUsers,
  } = useUser()
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false)
  const { fetchError: fetchAnswersError, fetchFriendAnswers } =
    useFriendAnswers()
  const { fetchError: fetchSelfAnswersError, fetchSelfAnswers } =
    useSelfAnswers()

  const [errorMessage, setErrorMessage] = useState<string>("")
  const { page } = usePage()

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
    if (!!user && !authenticating && !signingUp) {
      requestNotificationPermission().catch((error) => {
        console.error("Error requesting notification permission:", error)
        // Alert.alert(
        //   "Notification Permission",
        //   "We couldn't enable notifications. You can enable them in your device settings if you'd like to receive updates."
        // )
      })
    }
  }, [!!user, authenticating, signingUp])

  useEffect(() => {
    if (fetchAnswersError || fetchSelfAnswersError) {
      setErrorMessage(
        fetchAnswersError || fetchSelfAnswersError || "An error occurred"
      )
      setIsErrorModalVisible(true)
    }
  }, [fetchAnswersError, fetchSelfAnswersError])

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
      setUpdateString(`${updateString}\nError checking for updates: ${error}`)
    }
  }

  const handleErrorModalClose = () => {
    setIsErrorModalVisible(false)
    if (fetchAnswersError) {
      fetchFriendAnswers()
    } else if (fetchSelfAnswersError) {
      fetchSelfAnswers()
    }
  }

  if (!loaded) {
    return null
  }

  if (!authenticating && !user) {
    return <AccountScreen />
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style={"dark"} />
      <View style={[styles.container]}>
        <View style={styles.debugButtonContainer}>
          <Button title="Debug" onPress={() => setIsDebugVisible(true)} />
        </View>

        <View style={[styles.fullPageView, styles.cameraView]}>
          {page === "questions" ? (
            allUsers.length > 0 ? (
              <App />
            ) : null
          ) : page === "results" ? (
            <ResultsView />
          ) : (
            <QuizzesView />
          )}
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
          retry={fetchAnswersError ? fetchFriendAnswers : fetchSelfAnswers}
        />
      </View>
      <NavBar />
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  debugButtonContainer: {
    position: "absolute",
    top: 50,
    right: 10,
    zIndex: 1000,
    opacity: 0, // Removed to make debug button visible
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
    <EnvironmentProvider>
      <UserProvider>
        <NotificationProvider>
          <AnswerProvider>
            <SelfAnswerProvider>
              <PageProvider>
                <RootLayout />
              </PageProvider>
            </SelfAnswerProvider>
          </AnswerProvider>
        </NotificationProvider>
      </UserProvider>
    </EnvironmentProvider>
  )
}
