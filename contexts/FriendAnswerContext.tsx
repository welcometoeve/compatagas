import React, { createContext, useContext, useState, useEffect } from "react"
import {
  createClient,
  PostgrestError,
  RealtimeChannel,
} from "@supabase/supabase-js"
import { useUser } from "./UserContext"
import { useSelfAnswers } from "./SelfAnswerContext"
import { questions } from "@/constants/questions/questions"
import { useNotification } from "./notification/NotificationContext"
import { SupabaseKey, SupabaseUrl } from "@/constants/constants"
import { useEnvironment } from "./EnvironmentContext"
import { useFriends } from "./FriendContext"

// Create Supabase client
const supabase = createClient(SupabaseUrl, SupabaseKey)

export type FriendAnswer = {
  id: number
  friendId: number
  selfId: number
  questionId: number
  optionIndex: number
  quizId: number
}

type FriendAnswerContextType = {
  friendAnswers: FriendAnswer[]
  addFriendAnswer: (
    selfId: number,
    questionId: number,
    optionIndex: number
  ) => Promise<string | undefined> // Return error message if failed
  fetchError: string | null
  isLoading: boolean
  fetchFriendAnswers: () => Promise<void>
}

const AnswerContext = createContext<FriendAnswerContextType | undefined>(
  undefined
)

export const AnswerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [answers, setAnswers] = useState<FriendAnswer[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()
  const { allUsers } = useFriends()

  const { notifications, fetchNotifications, addNotification } =
    useNotification()
  const { isDev } = useEnvironment()

  const tableName = isDev ? "_FriendAnswer_dev" : "FriendAnswer"
  useEffect(() => {
    let subscription: RealtimeChannel | null = null
    if (user) {
      fetchAnswers()

      // Set up real-time subscription
      subscription = supabase
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
            fetchAnswers()
          }
        )
        .subscribe()
    }

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [user, allUsers, isDev, tableName])

  const fetchAnswers = async () => {
    if (!user) return

    setIsLoading(true)
    setFetchError(null)

    const friendIds = allUsers.map((u) => u.id)
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .or(
        `and(selfId.eq.${user.id},friendId.in.(${friendIds})),and(friendId.eq.${user.id},selfId.in.(${friendIds}))`
      )

    if (error) {
      console.error("Error fetching friend answers:", error)
      setFetchError("Error fetching friend answers")
    } else {
      setAnswers(data)
    }

    setIsLoading(false)
  }

  const addAnswer = async (
    selfId: number,
    questionId: number,
    optionIndex: number
  ) => {
    if (!user) return

    // Check if the answer already exists
    const exists = answers.some(
      (a) =>
        a.friendId === user.id &&
        a.selfId === selfId &&
        a.questionId === questionId
    )

    if (exists) {
      return "Answer already exists for this friend and question"
    }

    const newAnswer: Omit<FriendAnswer, "id"> = {
      friendId: user.id,
      selfId: selfId,
      questionId,
      optionIndex,
      quizId: questions.find((q) => q.id === questionId)?.quizId || 0,
    }
    const { data, error } = await supabase
      .from(tableName)
      .insert(newAnswer)
      .select()

    if (error) {
      console.error("Error adding friend answer:", error)
      return "Error adding friend answer"
    } else if (data) {
      // Handle successful insertion if needed
    }
  }

  return (
    <AnswerContext.Provider
      value={{
        friendAnswers: answers,
        addFriendAnswer: addAnswer,
        fetchError,
        isLoading,
        fetchFriendAnswers: fetchAnswers,
      }}
    >
      {children}
    </AnswerContext.Provider>
  )
}

export const useFriendAnswers = () => {
  const context = useContext(AnswerContext)
  if (context === undefined) {
    throw new Error("useFriendAnswers must be used within an AnswerProvider")
  }
  return context
}
