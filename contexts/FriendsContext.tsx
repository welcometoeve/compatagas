import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import { createClient } from "@supabase/supabase-js"
import { SupabaseKey, SupabaseUrl } from "@/constants/constants"
import { useEnvironment } from "./EnvironmentContext"
import { UserProfile, useUser } from "./UserContext"

type FriendRelation = {
  userId1: number
  userId2: number
}

type FriendsContextType = {
  allUsers: UserProfile[]
  getFriends: (userId: number) => UserProfile[]
  addFriendRelationship: (
    userId1: number,
    userId2: number
  ) => Promise<void | any>
  removeFriendRelationship: (
    userId1: number,
    userId2: number
  ) => Promise<void | any>
}

// Create Supabase client
const supabase = createClient(SupabaseUrl, SupabaseKey)

// Create context
const FriendsContext = createContext<FriendsContextType | undefined>(undefined)

// Create provider component
export const FriendsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDev } = useEnvironment()
  const { user } = useUser()
  const [allUsers, setAllUsers] = useState<UserProfile[]>([])
  const [friendRelations, setFriendRelations] = useState<FriendRelation[]>([])

  const tableName = isDev ? "_User_dev" : "User"
  const friendRelationTableName = isDev
    ? "_FriendRelation_dev"
    : "FriendRelation"

  const fetchAllUsers = async () => {
    let query = supabase
      .from(tableName)
      .select("*")
      .eq("deleted", false)
      .order("createdAt", { ascending: false })

    const { data, error } = await query
    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setAllUsers(data)
    }
  }

  const fetchFriendRelations = async () => {
    const { data, error } = await supabase
      .from(friendRelationTableName)
      .select("userId1, userId2")

    if (error) {
      console.error("Error fetching friend relations:", error)
    } else {
      setFriendRelations(data)
    }
  }

  const getFriends = (userId: number): UserProfile[] => {
    const friendIds = friendRelations
      .filter(
        (relation) => relation.userId1 === userId || relation.userId2 === userId
      )
      .map((relation) =>
        relation.userId1 === userId ? relation.userId2 : relation.userId1
      )

    return allUsers.filter((user) => friendIds.includes(user.id))
  }

  const addFriendRelationship = async (userId1: number, userId2: number) => {
    try {
      // Check if the relationship already exists
      const existingRelation = friendRelations.find(
        (relation) =>
          (relation.userId1 === userId1 && relation.userId2 === userId2) ||
          (relation.userId1 === userId2 && relation.userId2 === userId1)
      )

      if (existingRelation) {
        throw new Error("Friend relationship already exists")
      }

      // Add the new relationship
      const { error: insertError } = await supabase
        .from(friendRelationTableName)
        .insert([{ userId1, userId2 }])

      if (insertError) {
        throw new Error("Error adding friend relationship")
      }

      // Update friend relations locally
      setFriendRelations((prev) => [...prev, { userId1, userId2 }])
    } catch (error) {
      console.error("Error in addFriendRelationship:", error)
      return error
    }
  }

  const removeFriendRelationship = async (userId1: number, userId2: number) => {
    try {
      const { error } = await supabase
        .from(friendRelationTableName)
        .delete()
        .or(
          `and(userId1.eq.${userId1},userId2.eq.${userId2}),and(userId1.eq.${userId2},userId2.eq.${userId1})`
        )

      if (error) {
        throw new Error("Error removing friend relationship")
      }

      // Update friend relations locally
      setFriendRelations((prev) =>
        prev.filter(
          (relation) =>
            !(relation.userId1 === userId1 && relation.userId2 === userId2) &&
            !(relation.userId1 === userId2 && relation.userId2 === userId1)
        )
      )
    } catch (error) {
      console.error("Error in removeFriendRelationship:", error)
      return error
    }
  }

  useEffect(() => {
    fetchAllUsers()
    fetchFriendRelations()
  }, [user, tableName])

  useEffect(() => {
    const friendRelationSubscription = supabase
      .channel(friendRelationTableName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: friendRelationTableName },
        (payload) => {
          console.log(payload)
          fetchFriendRelations()
        }
      )
      .subscribe()

    const allUsersSubscription = supabase
      .channel(tableName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: tableName },
        (payload) => {
          console.log(payload)
          fetchAllUsers()
        }
      )
      .subscribe()

    return () => {
      friendRelationSubscription.unsubscribe()
      allUsersSubscription.unsubscribe()
    }
  }, [isDev, tableName, friendRelationTableName])

  return (
    <FriendsContext.Provider
      value={{
        allUsers,
        getFriends,
        addFriendRelationship,
        removeFriendRelationship,
      }}
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
