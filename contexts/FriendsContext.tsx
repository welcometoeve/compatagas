import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { createClient } from "@supabase/supabase-js"
import { useUser, UserProfile } from "./UserContext" // Assuming UserContext is in a separate file
import { SupabaseKey, SupabaseUrl } from "@/constants"

type FriendsContextType = {
  friends: UserProfile[]
  loading: boolean
  error: string | null
  refreshFriends: () => Promise<void>
}

const supabase = createClient(SupabaseUrl, SupabaseKey)

// Create context
const FriendsContext = createContext<FriendsContextType | undefined>(undefined)

// Create provider component
export const FriendsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [friends, setFriends] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  const fetchFriends = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .neq("id", user.id)

      if (error) throw error

      setFriends(data)
    } catch (err) {
      setError("Failed to fetch friends")
      console.error("Error fetching friends:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchFriends()
    }
  }, [user])

  const refreshFriends = async () => {
    await fetchFriends()
  }

  return (
    <FriendsContext.Provider
      value={{ friends, loading, error, refreshFriends }}
    >
      {children}
    </FriendsContext.Provider>
  )
}

// Custom hook to use the context
export const useFriends = () => {
  const context = useContext(FriendsContext)
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendsProvider")
  }
  return context
}
