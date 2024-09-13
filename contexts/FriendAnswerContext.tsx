import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient, PostgrestError } from "@supabase/supabase-js"
import { useUser } from "./UserContext"
import { useFriends } from "./FriendsContext"
import { SupabaseKey, SupabaseUrl } from "@/constants"
import { useSelfAnswers } from "./SelfAnswerContext"

// Create Supabase client
const supabase = createClient(SupabaseUrl, SupabaseKey)

export type FriendAnswer = {
  id: number
  friendId: number
  selfId: number
  questionId: number
  optionIndex: number
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
  const { friends } = useFriends()

  useEffect(() => {
    if (user) {
      fetchAnswers()
    }
  }, [user, friends])

  const fetchAnswers = async () => {
    if (!user) return

    setIsLoading(true)
    setFetchError(null)

    const { data, error } = await supabase
      .from("FriendAnswer")
      .select("*")
      .eq("friendId", user.id)

    if (error) {
      console.error("Error fetching answers:", error)
      setFetchError("Error fetching answers")
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

    const newAnswer: Omit<FriendAnswer, "id"> = {
      friendId: user.id,
      selfId: selfId,
      questionId,
      optionIndex,
    }

    const { data, error } = await supabase
      .from("FriendAnswer")
      .insert(newAnswer)
      .select()

    if (error) {
      console.error("Error adding answer:", error)
      return "Error adding answer"
    } else if (data) {
      setAnswers([...answers, data[0]])
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
    throw new Error("useAnswers must be used within an AnswerProvider")
  }
  return context
}
