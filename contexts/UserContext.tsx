import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { parse } from "@babel/core"

// Define types
type User = {
  id: number
  phoneNumber: number
  name: string | null
}

type UserContextType = {
  user: User | null
  authenticating: boolean
  signingUp: boolean
  createUser: (phoneNumber: number, name: string) => undefined
}

// Create Supabase client
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!
)

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Create provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [authenticating, setAuthenticating] = useState(true)
  const [signingUp, setSigningIn] = useState(false)

  // const authenticate = async (phoneNumber: number): Promise<User | null> => {
  //   setSigningIn(true)
  //   try {
  //     const { data, error } = await supabase
  //       .from("User")
  //       .select("*")
  //       .eq("phoneNumber", phoneNumber)
  //       .single()

  //     if (error || !data) return null
  //     setUser(data)
  //     await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
  //     return data
  //   } finally {
  //     setSigningIn(false)
  //   }
  // }

  // const createUser = async (
  //   phoneNumber: number,
  //   name: string
  // ): Promise<User> => {
  //   setSigningIn(true)
  //   try {
  //     // First, try to fetch the user
  //     const { data: existingUser, error: fetchError } = await supabase
  //       .from("User")
  //       .select("*")
  //       .eq("phoneNumber", phoneNumber)
  //       .single()

  //     if (fetchError && fetchError.code !== "PGRST116") {
  //       // PGRST116 is the error code for "Results contain 0 rows"
  //       throw new Error("Failed to check for existing user")
  //     }

  //     if (existingUser) {
  //       // User already exists, return the existing user
  //       setUser(existingUser)
  //       await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
  //       return existingUser
  //     }

  //     // User doesn't exist, insert a new user
  //     const { data: newUser, error: insertError } = await supabase
  //       .from("User")
  //       .insert({ phoneNumber: phoneNumber, name: name })
  //       .select()
  //       .single()

  //     if (insertError || !newUser) {
  //       throw new Error("Failed to create user")
  //     }

  //     setUser(newUser)
  //     await AsyncStorage.setItem("phoneNumber", phoneNumber.toString())
  //     return newUser
  //   } finally {
  //     setSigningIn(false)
  //   }
  // }

  // useEffect(() => {
  //   const initializeUser = async () => {
  //     setAuthenticating(true)
  //     try {
  //       const storedPhoneNumber = await AsyncStorage.getItem("phoneNumber")
  //       if (storedPhoneNumber) {
  //         await authenticate(parseInt(storedPhoneNumber))
  //       }
  //     } finally {
  //       setAuthenticating(false)
  //     }
  //   }

  //   initializeUser()
  // }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        authenticating,
        signingUp,
        createUser: (phoneNumber: number, name: string) => undefined,
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
