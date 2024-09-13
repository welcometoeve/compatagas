import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { SupabaseKey, SupabaseUrl } from "@/constants"

// Define types
export type UserProfile = {
  id: number
  phoneNumber: number
  name: string | null
}

type UserContextType = {
  user: UserProfile | null
  allUsers: UserProfile[]
  authenticating: boolean
  signingUp: boolean
  createUser: (phoneNumber: number, name: string) => Promise<UserProfile>
  clearUser: () => void
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

  const authenticate = async (
    phoneNumber: number
  ): Promise<UserProfile | null> => {
    setSigningUp(true)
    try {
      const { data, error } = await supabase
        .from("User")
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
      // First, try to fetch the user
      const { data: existingUser, error: fetchError } = await supabase
        .from("User")
        .select("*")
        .eq("phoneNumber", phoneNumber)
        .single()

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is the error code for "Results contain 0 rows"
        throw new Error("Failed to check for existing user")
      }

      if (existingUser) {
        // User already exists, return the existing user
        setUser(existingUser)
        await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
        return existingUser
      }

      // User doesn't exist, insert a new user
      const { data: newUser, error: insertError } = await supabase
        .from("User")
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
    const { data, error } = await supabase.from("User").select("*")
    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setAllUsers(data)
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
        await fetchAllUsers()
      } finally {
        setAuthenticating(false)
      }
    }

    initializeUser()

    // Set up real-time subscription
    const subscription = supabase
      .channel("public:User")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "User" },
        (payload) => {
          console.log("Change received!", payload)
          fetchAllUsers() // Refetch all users when there's a change
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        allUsers,
        authenticating,
        signingUp,
        createUser,
        clearUser: () => setUser(null),
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
