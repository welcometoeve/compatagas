import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { SupabaseKey, SupabaseUrl } from "@/constants/constants"
import { useUser } from "../UserContext"
import { useEnvironment } from "../EnvironmentContext"
import { useFriends } from "../FriendsContext"
import * as Notifications from "expo-notifications"

// Initialize Supabase client
const supabase: SupabaseClient = createClient(SupabaseUrl, SupabaseKey)

// Define the shape of a notification
export interface CustomNotification {
  id: number
  createdAt: string
  quizId: number
  selfId: number
  friendId: number
  selfOpened: boolean
  friendOpened: boolean
}

// Define the shape of the context
interface NotificationContextType {
  notifications: CustomNotification[]
  fetchNotifications: () => Promise<CustomNotification[]>
  addNotification: (
    selfId: number,
    friendId: number,
    quizId: number
  ) => Promise<CustomNotification | null>
  markAsOpened: (
    notification: CustomNotification,
    isSelf: boolean
  ) => Promise<boolean>
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<CustomNotification[]>([])
  const { user } = useUser()
  const { isDev } = useEnvironment()

  const tableName = isDev ? "_Notification_dev" : "Notification"

  const fetchNotifications = useCallback(async (): Promise<
    CustomNotification[]
  > => {
    if (!user) return []

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("createdAt", { ascending: false })

    if (error) {
      console.error("Error fetching notifications:", error)
      return []
    }

    setNotifications(data as CustomNotification[])
    console.log("")
    return data as CustomNotification[]
  }, [user, tableName])

  const addNotification = useCallback(
    async (
      selfId: number,
      friendId: number,
      quizId: number
    ): Promise<CustomNotification | null> => {
      const { data, error } = await supabase
        .from(tableName)
        .insert([{ selfId, friendId, quizId }])
        .select()

      if (error) {
        console.error("Error adding notification:", error)
        return null
      }

      const newNotification = data[0] as CustomNotification
      const newNotifications = [...notifications, newNotification]
      setNotifications(newNotifications)

      const numNotificationsActive = newNotifications.filter(
        (n) =>
          (n.selfId === user?.id && !n.selfOpened) ||
          (n.friendId === user?.id && !n.friendOpened)
      ).length

      await Notifications.setBadgeCountAsync(numNotificationsActive)

      return newNotification
    },
    [tableName]
  )

  const markAsOpened = useCallback(
    async (
      notification: CustomNotification,
      isSelf: boolean
    ): Promise<boolean> => {
      const updateObject = isSelf
        ? { selfOpened: true }
        : { friendOpened: true }

      try {
        const { data, error } = await supabase
          .from(tableName)
          .upsert({ ...notification, ...updateObject })
          .select()

        if (error) {
          console.error("Error marking notification as opened:", error)
          return false
        }

        if (data === null) {
          console.error("Unexpected null data from Supabase")
          return false
        }

        if (data && data.length > 0) {
          const newNotifications = notifications.map((n) =>
            n.id === notification.id ? { ...notification, ...updateObject } : n
          )
          setNotifications(newNotifications)

          const numNotificationsActive = newNotifications.filter(
            (n) =>
              (n.selfId === user?.id && !n.selfOpened) ||
              (n.friendId === user?.id && !n.friendOpened)
          ).length

          await Notifications.setBadgeCountAsync(numNotificationsActive)

          return true
        } else {
          console.error("No data returned from upsert operation")
          return false
        }
      } catch (e) {
        console.error("Unexpected error in markAsOpened:", e)
        return false
      }
    },
    [tableName]
  )

  useEffect(() => {
    if (user) {
      fetchNotifications()

      // Set up real-time subscription
      const subscription = supabase
        .channel(tableName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: tableName,
          },
          (payload) => {
            console.log(payload)
            fetchNotifications()
          }
        )
        .subscribe()

      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [fetchNotifications, user, tableName])

  const contextValue: NotificationContextType = {
    notifications,
    fetchNotifications,
    addNotification,
    markAsOpened,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    )
  }
  return context
}
