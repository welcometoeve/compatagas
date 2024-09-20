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
import { UserProfile, useUser } from "./UserContext"

type FriendsContextType = {
  allUsers: UserProfile[]
}

// Create Supabase client
const supabase = createClient(SupabaseUrl, SupabaseKey)

// Create context
const UserContext = createContext<FriendsContextType | undefined>(undefined)

// Create provider component
export const FriendsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDev } = useEnvironment()
  const { user } = useUser()
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])

  const tableName = isDev ? "_User_dev" : "User"
  const friendRelationTableName = isDev
    ? "_FriendRelation_dev"
    : "FriendRelation"

  const fetchAllUsers = async () => {
    if (!user) return
    const { data: friendRelations, error: friendRelationsError } =
      await supabase
        .from(friendRelationTableName)
        .select("userId1, userId2")
        .or(`userId1.eq.${user.id},userId2.eq.${user.id}`)

    if (friendRelationsError) {
      console.error("Error fetching friend relations:", friendRelationsError)
      return
    }

    const friendIds = new Set([
      ...friendRelations.flatMap((relation) => [
        relation.userId1,
        relation.userId2,
      ]),
      user.id,
    ])

    let query = supabase
      .from(tableName)
      .select("*")
      .eq("deleted", false)
      .in("id", Array.from(friendIds))
      .order("name")

    const { data, error } = await query
    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setAllUsers(data)
    }
  }

  useEffect(() => {
    fetchAllUsers()
  }, [user, tableName])

  useEffect(() => {
    const friendRelationSubscription = supabase
      .channel(friendRelationTableName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: friendRelationTableName },
        (payload) => {
          console.log(payload)
          fetchAllUsers()
        }
      )
      .subscribe()

    return () => {
      friendRelationSubscription.unsubscribe()
    }
  }, [isDev, tableName, friendRelationTableName])

  return (
    <UserContext.Provider
      value={{
        allUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Custom hook to use the context
export const useFriends = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
