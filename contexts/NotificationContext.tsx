import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { SupabaseKey, SupabaseUrl } from "@/constants"
import { useUser } from "./UserContext"

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
  removeNotification: (id: number) => Promise<boolean>
  markAsOpened: (id: number, isSelf: boolean) => Promise<boolean>
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

  const fetchNotifications = useCallback(async (): Promise<
    CustomNotification[]
  > => {
    if (!user) return []

    const { data, error } = await supabase
      .from("Notification")
      .select("*")
      .or(`selfId.eq.${user.id},friendId.eq.${user.id}`)
      .order("createdAt", { ascending: false })

    if (error) {
      console.error("Error fetching notifications:", error)
      return []
    }

    setNotifications(data as CustomNotification[])
    return data as CustomNotification[]
  }, [user])

  const addNotification = useCallback(
    async (
      selfId: number,
      friendId: number,
      quizId: number
    ): Promise<CustomNotification | null> => {
      const { data, error } = await supabase
        .from("Notification")
        .insert([{ selfId, friendId, quizId }])
        .select()

      if (error) {
        console.error("Error adding notification:", error)
        return null
      }

      const newNotification = data[0] as CustomNotification
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        newNotification,
      ])
      return newNotification
    },
    []
  )

  const removeNotification = useCallback(
    async (id: number): Promise<boolean> => {
      const { error } = await supabase
        .from("Notification")
        .delete()
        .match({ id })

      if (error) {
        console.error("Error removing notification:", error)
        return false
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      )
      return true
    },
    []
  )

  const markAsOpened = useCallback(
    async (id: number, isSelf: boolean): Promise<boolean> => {
      const field = isSelf ? "selfOpened" : "friendOpened"
      const { error } = await supabase
        .from("Notification")
        .update({ [field]: true })
        .match({ id })

      if (error) {
        console.error("Error marking notification as opened:", error)
        return false
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, [field]: true }
            : notification
        )
      )
      return true
    },
    []
  )

  useEffect(() => {
    if (user) {
      fetchNotifications()

      // Set up real-time subscription
      const subscription = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Notification",
          },
          (payload) => {
            fetchNotifications()
          }
        )
        .subscribe()

      // Clean up subscription on unmount
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [fetchNotifications, user])

  const contextValue: NotificationContextType = {
    notifications,
    fetchNotifications,
    addNotification,
    removeNotification,
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
