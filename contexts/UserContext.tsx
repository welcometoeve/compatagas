import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import { Alert } from "react-native"
import { SupabaseKey, SupabaseUrl } from "@/constants/constants"
import { useEnvironment } from "./EnvironmentContext"
import getRandomEmoji from "@/components/profile/getRandomEmoji"

// Define types
export type UserProfile = {
  id: number
  phoneNumber: number
  name: string | null
  lastName: string | null
  notificationToken?: string
  emoji: string | null
  numLemons: number
  unlockedQuizIds: number[]
}

type UserContextType = {
  user: UserProfile | null
  authenticating: boolean
  signingUp: boolean
  createUser: (
    phoneNumber: number,
    name: string,
    lastName: string,
    emoji?: string
  ) => Promise<UserProfile>
  clearUser: () => void
  requestNotificationPermission: () => Promise<void>
  lastNotification: Notifications.Notification | null
  addLemon: () => Promise<void>
  unlockQuiz: (quizId: number) => Promise<void>
}

// Create Supabase client
const supabase = createClient(SupabaseUrl, SupabaseKey)

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Create provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [authenticating, setAuthenticating] = useState(true)
  const [signingUp, setSigningUp] = useState(false)
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null)
  const { isDev } = useEnvironment()

  const tableName = isDev ? "_User_dev" : "User"
  const friendRelationTableName = isDev
    ? "_FriendRelation_dev"
    : "FriendRelation"

  const authenticate = async (
    phoneNumber: number
  ): Promise<UserProfile | null> => {
    setSigningUp(true)

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("phoneNumber", phoneNumber)
        .single()
      if (error || !data) return null
      setUser(data)
      await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
      return data
    } finally {
      setSigningUp(false)
    }
  }

  const createUser = async (
    phoneNumber: number,
    name: string,
    lastName: string,
    emoji?: string
  ): Promise<UserProfile> => {
    setSigningUp(true)
    try {
      await AsyncStorage.setItem(`phoneNumber`, phoneNumber.toString())

      const { data: existingUser, error: fetchError } = await supabase
        .from(tableName)
        .select("*")
        .eq("phoneNumber", phoneNumber)

      if (fetchError) {
        console.error("Error fetching user:", fetchError)
        throw new Error("Failed to fetch user")
      }

      const addingEmoji = emoji
        ? emoji
        : existingUser[0]?.emoji
        ? undefined
        : getRandomEmoji()

      const { data: newUser, error: insertError } = await supabase
        .from(tableName)
        .upsert(
          {
            phoneNumber: phoneNumber,
            name: name,
            lastName: lastName,
            emoji: addingEmoji,
          },
          { onConflict: "phoneNumber", ignoreDuplicates: false }
        )
        .select()
        .single()

      if (insertError || !newUser) {
        console.log("Error creating user:", insertError)
        throw new Error("Failed to create user")
      }

      setUser(newUser)
      await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
      return newUser
    } finally {
      setSigningUp(false)
    }
  }

  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    if (finalStatus !== "granted") {
      return
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data

    if (user) {
      const { error } = await supabase
        .from(tableName)
        .update({ notificationToken: token })
        .eq("id", user.id)

      if (error) {
        console.error("Error saving notification token:", error)
        Alert.alert("Failed to save notification token")
      } else {
        setUser({ ...user, notificationToken: token })
      }
    }

    // Set up notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })
  }

  const addLemon = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from(tableName)
      .update({ numLemons: user.numLemons + 1 })
      .eq("id", user.id)
      .select()
      .single()
    if (error) {
      console.error("Error adding lemon:", error)
      Alert.alert("Failed to add lemon")
    } else if (data) {
      setUser(data)
    }
  }

  const unlockQuiz = async (quizId: number) => {
    if (!user) return

    if (user.unlockedQuizIds.includes(quizId)) {
      Alert.alert("Quiz already unlocked")
      return
    }

    if (user.numLemons < 3) {
      Alert.alert("Not enough lemons to unlock quiz")
      return
    }

    const newUnlockedQuizIds = [...user.unlockedQuizIds, quizId]
    const newNumLemons = user.numLemons - 3

    const { data, error } = await supabase
      .from(tableName)
      .update({
        unlockedQuizIds: newUnlockedQuizIds,
        numLemons: newNumLemons,
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error unlocking quiz:", error)
      Alert.alert("Failed to unlock quiz")
    } else if (data) {
      setUser(data)
    }
  }

  useEffect(() => {
    const initializeUser = async () => {
      setAuthenticating(true)
      try {
        const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber")
        if (storedPhoneNumber) {
          await authenticate(parseInt(storedPhoneNumber))
        }
        await requestNotificationPermission()
      } finally {
        setAuthenticating(false)
      }
    }

    initializeUser()
  }, [])

  // Set up notification listeners
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      setLastNotification(notification)
    }
  )

  return (
    <UserContext.Provider
      value={{
        user,
        authenticating,
        signingUp,
        createUser,
        clearUser: () => setUser(null),
        requestNotificationPermission,
        lastNotification,
        addLemon,
        unlockQuiz,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
