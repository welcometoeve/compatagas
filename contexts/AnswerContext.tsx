import React, { createContext, useContext, useState, useEffect } from "react"
import { createClient, PostgrestError } from "@supabase/supabase-js"
import { useUser } from "./UserContext"
import { useFriends } from "./FriendsContext"

// Create Supabase client
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!
)

export type Answer = {
  id: number
  answererId: number
  userItsAboutId: number
  questionId: number
  optionIndex: number
}

type AnswerContextType = {
  answers: Answer[]
  addAnswer: (
    userItsAboutId: number,
    questionId: number,
    optionIndex: number
  ) => Promise<string | undefined> // Return error message if failed
  fetchError: string | null
  isLoading: boolean
  fetchAnswers: () => Promise<void>
}

const AnswerContext = createContext<AnswerContextType | undefined>(undefined)

export const AnswerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [answers, setAnswers] = useState<Answer[]>([])
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
      .from("Answer")
      .select("*")
      .eq("answererId", user.id)

    if (error) {
      console.error("Error fetching answers:", error)
      setFetchError("Error fetching answers")
    } else {
      setAnswers(data)
    }

    setIsLoading(false)
  }

  const addAnswer = async (
    userItsAboutId: number,
    questionId: number,
    optionIndex: number
  ) => {
    if (!user) return

    const newAnswer: Omit<Answer, "id"> = {
      answererId: user.id,
      userItsAboutId,
      questionId,
      optionIndex,
    }

    const { data, error } = await supabase
      .from("Answer")
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
        answers,
        addAnswer,
        fetchError,
        isLoading,
        fetchAnswers,
      }}
    >
      {children}
    </AnswerContext.Provider>
  )
}

export const useAnswers = () => {
  const context = useContext(AnswerContext)
  if (context === undefined) {
    throw new Error("useAnswers must be used within an AnswerProvider")
  }
  return context
}
