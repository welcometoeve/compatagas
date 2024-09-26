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
import { NotificationProvider } from "@/contexts/notification/NotificationContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { EnvironmentProvider } from "@/contexts/EnvironmentContext"
import { PageProvider, PageStackItem, usePage } from "@/contexts/PageContext"
import ProfilePage from "./(tabs)/ProfilePage"
import { FriendsProvider, useFriends } from "@/contexts/FriendsContext"
import IntroScreen, { useAccessGranted } from "./(tabs)/IntroScreen"
import TakeQuizView from "@/components/quizzes/takeQuizView/TakeQuizView"
import QuizResultsView from "@/components/results/QuizResultView"
import QuizResultView from "@/components/results/QuizResultView"
import QuizFeed from "./(tabs)/Feed"
import App from "./(tabs)"

SplashScreen.preventAutoHideAsync()

function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  })
  const appState = useRef(AppState.currentState)
  const [isDebugVisible, setIsDebugVisible] = useState<boolean>(false)
  const [update, setUpdate] = useState<Updates.UpdateCheckResult | null>(null)
  const [updateString, setUpdateString] = useState<string>("")
  const { user, authenticating, signingUp, requestNotificationPermission } =
    useUser()
  const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false)
  const { fetchError: fetchAnswersError, fetchFriendAnswers } =
    useFriendAnswers()
  const { fetchError: fetchSelfAnswersError, fetchSelfAnswers } =
    useSelfAnswers()

  const [errorMessage, setErrorMessage] = useState<string>("")
  const { pageStack } = usePage()
  const { accessGranted, setAccessGranted } = useAccessGranted()

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
      setUpdateString(updateString + JSON.stringify(updateResult))
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

  if (!accessGranted) {
    return <IntroScreen onAccessGranted={() => setAccessGranted(true)} />
  }

  if (!authenticating && !user) {
    return (
      <>
        <View style={styles.debugButtonContainer}>
          <Button title="Debug" onPress={() => setIsDebugVisible(true)} />
        </View>
        <AccountScreen />
        <DebugView
          isVisible={isDebugVisible}
          onClose={() => setIsDebugVisible(false)}
          update={update}
          updateString={updateString}
          setAccessGranted={setAccessGranted}
        />
      </>
    )
  }

  const lastPage = pageStack[pageStack.length - 1] as PageStackItem | null
  return (
    <ThemeProvider value={DefaultTheme}>
      <StatusBar style={"dark"} />
      <View style={[styles.container]}>
        <View style={styles.debugButtonContainer}>
          <Button title="Debug" onPress={() => setIsDebugVisible(true)} />
        </View>

        <View style={[styles.fullPageView, styles.cameraView]}>
          {lastPage?.type === "profile" ? (
            <ProfilePage userId={lastPage?.userId ?? 0} />
          ) : lastPage?.type === "newPacks" ? (
            <QuizzesView />
          ) : lastPage?.type === "takeQuiz" ? (
            <TakeQuizView
              quizId={lastPage?.quizId ?? 0}
              userId={lastPage.userId}
            />
          ) : lastPage?.type === "quizResult" ? (
            <QuizResultView
              quizId={lastPage?.quizId ?? 0}
              selfId={lastPage?.userId ?? 0}
              friendIds={lastPage?.friendIds ?? []}
            />
          ) : lastPage?.type === "feed" ? (
            <App />
          ) : null}
        </View>
        <DebugView
          isVisible={isDebugVisible}
          onClose={() => setIsDebugVisible(false)}
          update={update}
          updateString={updateString}
          setAccessGranted={setAccessGranted}
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
        <FriendsProvider>
          <NotificationProvider>
            <AnswerProvider>
              <SelfAnswerProvider>
                <PageProvider>
                  <RootLayout />
                </PageProvider>
              </SelfAnswerProvider>
            </AnswerProvider>
          </NotificationProvider>
        </FriendsProvider>
      </UserProvider>
    </EnvironmentProvider>
  )
}
