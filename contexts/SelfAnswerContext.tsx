import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient, PostgrestError } from "@supabase/supabase-js"
import { useUser } from "./UserContext"
import { useFriends } from "./FriendsContext"
import { SupabaseKey, SupabaseUrl } from "@/constants"

// Create Supabase client
const supabase = createClient(SupabaseUrl, SupabaseKey)

export type SelfAnswer = {
  id: number
  userId: number
  questionId: number
  optionIndex: number
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

    const { data, error } = await supabase.from("SelfAnswer").select("*")

    if (error) {
      console.error("Error fetching self answers:", error)
      setFetchError("Error fetching self answers")
    } else {
      setAnswers(data)
    }

    setIsLoading(false)
  }

  const addAnswer = async (questionId: number, optionIndex: number) => {
    if (!user) return

    const newAnswer: Omit<SelfAnswer, "id"> = {
      userId: user.id,
      questionId,
      optionIndex,
    }

    const { data, error } = await supabase
      .from("SelfAnswer")
      .insert(newAnswer)
      .select()

    if (error) {
      console.error("Error adding self answer:", error)
      return "Error adding self answer"
    } else if (data) {
      setAnswers([...answers, data[0]])
    }

    answers.push(data[0])
  }

  return (
    <SelfAnswerContext.Provider
      value={{
        selfAnswers: answers,
        addSelfAnswer: addAnswer,
        fetchError,
        isLoading,
        fetchSelfAnswers: fetchAnswers,
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
