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

// Define types
export type UserProfile = {
  id: number
  phoneNumber: number
  name: string | null
  notificationToken?: string
}

type UserContextType = {
  user: UserProfile | null
  allUsers: UserProfile[]
  friends: UserProfile[]
  authenticating: boolean
  signingUp: boolean
  createUser: (phoneNumber: number, name: string) => Promise<UserProfile>
  clearUser: () => void
  requestNotificationPermission: () => Promise<void>
  lastNotification: Notifications.Notification | null
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
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [friends, setFriends] = useState<UserProfile[]>([])
  const [authenticating, setAuthenticating] = useState(true)
  const [signingUp, setSigningUp] = useState(false)
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null)
  const { isDev } = useEnvironment()

  const userTableName = isDev ? "_User_dev" : "User"
  const friendRelationTableName = isDev
    ? "_FriendRelation_dev"
    : "FriendRelation"

  const authenticate = async (
    phoneNumber: number
  ): Promise<UserProfile | null> => {
    setSigningUp(true)
    try {
      const { data, error } = await supabase
        .from(userTableName)
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
    name: string
  ): Promise<UserProfile> => {
    setSigningUp(true)
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from(userTableName)
        .select("*")
        .eq("phoneNumber", parseInt(phoneNumber.toString()))
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error("Failed to check for existing user")
      }

      if (existingUser) {
        setUser(existingUser)
        await AsyncStorage.setItem(
          `phoneNumber-${userTableName}`,
          phoneNumber.toString()
        )
        return existingUser
      }

      const { data: newUser, error: insertError } = await supabase
        .from(userTableName)
        .insert({ phoneNumber: phoneNumber, name: name })
        .select()
        .single()

      if (insertError || !newUser) {
        throw new Error("Failed to create user")
      }

      setUser(newUser)
      await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
      return newUser
    } finally {
      setSigningUp(false)
    }
  }

  const fetchAllUsers = async () => {
    if (!user) return
    try {
      // Fetch all users
      const { data: userData, error: userError } = await supabase
        .from(userTableName)
        .select("*")

      if (userError) throw userError

      // Fetch friend relations for the current user
      const { data: friendData, error: friendError } = await supabase
        .from(friendRelationTableName)
        .select("userId2")
        .eq("userId1", user.id)

      if (friendError) throw friendError

      // Create a set of friend IDs for faster lookup
      const friendIds = new Set(friendData.map((relation) => relation.userId2))

      // Filter friends from all users
      const friendUsers = userData.filter((u) => friendIds.has(u.id))

      setAllUsers(userData)
      setFriends([user, ...friendUsers]) // Include the current user in the friends list
    } catch (error) {
      console.error("Error fetching users and friends:", error)
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
        .from(userTableName)
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

  useEffect(() => {
    fetchAllUsers()
  }, [user, userTableName, friendRelationTableName])

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

    // Set up notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setLastNotification(notification)
      }
    )

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response)
      })

    const subscription = supabase
      .channel(userTableName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: userTableName },
        (payload) => {
          fetchAllUsers()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [isDev, userTableName])

  console.log(friends.map((f) => f.id))
  return (
    <UserContext.Provider
      value={{
        user,
        allUsers,
        friends,
        authenticating,
        signingUp,
        createUser,
        clearUser: () => setUser(null),
        requestNotificationPermission,
        lastNotification,
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
