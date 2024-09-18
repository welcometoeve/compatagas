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
  const [authenticating, setAuthenticating] = useState(true)
  const [signingUp, setSigningUp] = useState(false)
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null)
  const { isDev } = useEnvironment()

  const tableName = isDev ? "User_dev" : "User"

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
    name: string
  ): Promise<UserProfile> => {
    setSigningUp(true)
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from(tableName)
        .select("*")
        .eq("phoneNumber", parseInt(phoneNumber.toString()))
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        throw new Error("Failed to check for existing user")
      }

      if (existingUser) {
        setUser(existingUser)
        await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
        return existingUser
      }

      const { data: newUser, error: insertError } = await supabase
        .from(tableName)
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
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("deleted", false)
      .not("id", "in", "(24)") // Exclude users with IDs 24 and 3

    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setAllUsers(data)
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

  useEffect(() => {
    const initializeUser = async () => {
      setAuthenticating(true)
      try {
        const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber")
        if (storedPhoneNumber) {
          await authenticate(parseInt(storedPhoneNumber))
        }
        await fetchAllUsers()
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
      .channel("public:User")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
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
  }, [isDev, tableName])

  return (
    <UserContext.Provider
      value={{
        user,
        allUsers,
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
