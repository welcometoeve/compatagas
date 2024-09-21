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

type FriendsContextType = {
  friends: UserProfile[]
  allUsers: UserProfile[]
  addFriendRelationship: (friendId: number) => Promise<void | any>
  removeFriendRelationship: (friendId: number) => Promise<void | any>
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
  const [friends, setFriends] = useState<UserProfile[]>([])
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
      .order("createdAt", { ascending: false }) // Sort by created_at, most recent first

    const { data, error } = await query
    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setAllUsers(data)
      setFriends(data.filter((u) => friendIds.has(u.id)))
      console.log("")
    }
  }

  const addFriendRelationship = async (friendId: number) => {
    try {
      // Check if the relationship already exists
      const { data: existingRelation, error: checkError } = await supabase
        .from(friendRelationTableName)
        .select("*")
        .or(
          `and(userId1.eq.${friendId},userId2.eq.${user?.id}),and(userId1.eq.${user?.id},userId2.eq.${friendId})`
        )
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        throw new Error("Error checking existing relationship")
      }

      if (existingRelation) {
        throw new Error("Friend relationship already exists")
      }

      // Add the new relationship
      const { error: insertError } = await supabase
        .from(friendRelationTableName)
        .insert([{ userId1: user?.id, userId2: friendId }])

      if (insertError) {
        throw new Error("Error adding friend relationship")
      }

      // Update friends list directly
      const newFriend = allUsers.find((u) => u.id === friendId)
      if (newFriend) {
        setFriends((prevFriends) => [
          ...prevFriends.filter((u) => u.id !== friendId),
          newFriend,
        ])
      }
    } catch (error) {
      console.error("Error in addFriendRelationship:", error)
      return error
    }
  }

  const removeFriendRelationship = async (friendId: number) => {
    try {
      const { error } = await supabase
        .from(friendRelationTableName)
        .delete()
        .or(
          `and(userId1.eq.${friendId},userId2.eq.${user?.id}),and(userId1.eq.${user?.id},userId2.eq.${friendId})`
        )

      if (error) {
        throw new Error("Error removing friend relationship")
      }

      // Update friends list directly
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      )
    } catch (error) {
      console.error("Error in removeFriendRelationship:", error)
      return error
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
    <UserContext.Provider
      value={{
        friends,
        allUsers,
        addFriendRelationship,
        removeFriendRelationship,
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
