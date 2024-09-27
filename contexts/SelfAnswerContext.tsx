import React, { createContext, useContext, useState, useEffect } from "react"
import {
  createClient,
  PostgrestError,
  RealtimeChannel,
} from "@supabase/supabase-js"
import { UserProfile, useUser } from "./UserContext"
import { SupabaseKey, SupabaseUrl } from "@/constants/constants"
import { questions } from "@/constants/questions/questions"
import { FriendAnswer, useFriendAnswers } from "./FriendAnswerContext"
import collect from "@/components/collect"
import { useEnvironment } from "./EnvironmentContext"
import { useNotification } from "./notification/NotificationContext"
import { useFriends } from "./FriendsContext"
import {
  StackSelfAnswer,
  useStackSelfAnswers,
} from "@/components/stack/useStackSelfAnswers"

// Create Supabase client
const supabase = createClient(SupabaseUrl, SupabaseKey)

export type SelfAnswer = {
  id: number
  userId: number
  questionId: number
  optionIndex: number
  quizId: number
  createdAt: string // Add this field to track creation time
}

type SelfAnswerContextType = {
  selfAnswers: SelfAnswer[] // all, not just for this user
  addSelfAnswer: (
    questionId: number,
    optionIndex: number
  ) => Promise<string | undefined> // Return error message if failed
  fetchError: string | null
  isLoading: boolean
  fetchSelfAnswers: () => Promise<void>
  stackSelfAnswers: StackSelfAnswer[]
  stackSelfAnswersLoading: boolean
  stackSelfAnswersError: any | null
  refetchStackSelfAnswers: () => Promise<void>
}

const SelfAnswerContext = createContext<SelfAnswerContextType | undefined>(
  undefined
)

export const SelfAnswerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [answers, setAnswers] = useState<SelfAnswer[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUser()

  const { addNotification } = useNotification()
  const { isDev } = useEnvironment()

  const {
    selfAnswers: stackSelfAnswers,
    loading: stackSelfAnswersLoading,
    error: stackSelfAnswersError,
    refetch: refetchStackSelfAnswers,
  } = useStackSelfAnswers(user?.id)

  const tableName = isDev ? "_SelfAnswer_dev" : "SelfAnswer"

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
  }, [user, isDev, tableName])

  const fetchAnswers = async () => {
    if (!user) return

    setIsLoading(true)
    setFetchError(null)

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order("createdAt", { ascending: false }) // Order by createdAt, most recent first

    if (error) {
      console.error("Error fetching self answers:", error)
      setFetchError("Error fetching self answers")
    } else {
      // console.log("Fetched self answers:", data)
      setAnswers(data)
    }

    setIsLoading(false)
  }

  const addAnswer = async (questionId: number, optionIndex: number) => {
    if (!user) return

    // Check if the answer already exists
    const exists = answers.some(
      (a) => a.userId === user.id && a.questionId === questionId
    )

    if (exists) {
      console.log("Answer already exists for this user and question")
      return null
    }

    const newAnswer: Omit<SelfAnswer, "id" | "createdAt"> = {
      userId: user.id,
      questionId,
      optionIndex,
      quizId: questions.find((q) => q.id === questionId)?.quizId || 0,
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert(newAnswer)
      .select()

    if (error) {
      console.log("Error adding self answer:", error)
      throw new Error("Failed to add self answer")
    } else if (data) {
      console.log("Added self answer:", data)
      return data ? data[0] : null
    }
  }

  return (
    <SelfAnswerContext.Provider
      value={{
        selfAnswers: answers,
        addSelfAnswer: addAnswer,
        fetchError,
        isLoading,
        fetchSelfAnswers: fetchAnswers,
        stackSelfAnswers,
        stackSelfAnswersLoading,
        stackSelfAnswersError,
        refetchStackSelfAnswers,
      }}
    >
      {children}
    </SelfAnswerContext.Provider>
  )
}

export const useSelfAnswers = () => {
  const context = useContext(SelfAnswerContext)
  if (context === undefined) {
    throw new Error("useAnswers must be used within an AnswerProvider")
  }
  return context
}
