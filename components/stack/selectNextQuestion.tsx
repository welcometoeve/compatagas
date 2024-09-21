import { MutableRefObject } from "react"

export interface SelectedQuestion {
  quizId: number
  questionId: number
  selfId: number
  answeredBySelf: boolean
  answered: boolean
}

const sameQuizOnly = false
const answeredByOthersOnly = true
const quizIdOrder: number[] = []

export default function selectNextQuestion(
  currentQuestionRef: MutableRefObject<SelectedQuestion | null>,
  questionsRef: MutableRefObject<SelectedQuestion[]>,
  devMode: boolean
): SelectedQuestion | null {
  const currentQuestion = currentQuestionRef.current
  const questions = questionsRef.current.filter((q) => !q.answered)

  if (questions.length === 0) {
    return null
  }

  // Helper function to check for unique user-question combination
  const isUniqueUserQuestion = (question: SelectedQuestion): boolean => {
    return !questions.some(
      (q) =>
        q !== question &&
        q.selfId === question.selfId &&
        q.questionId === question.questionId
    )
  }

  if (devMode) {
    // Priority 1: Select from specified quiz IDs in order
    if (quizIdOrder.length > 0) {
      for (const quizId of quizIdOrder) {
        const question = questions.find(
          (q) => q.quizId === quizId && isUniqueUserQuestion(q)
        )
        if (question) {
          return question
        }
      }
    }

    // Priority 2: Select from the same quiz
    if (sameQuizOnly) {
      const sameQuizQuestions = questions.filter(
        (q) => q.quizId === currentQuestion?.quizId && isUniqueUserQuestion(q)
      )
      if (sameQuizQuestions.length > 0) {
        return sameQuizQuestions[
          Math.floor(Math.random() * sameQuizQuestions.length)
        ]
      }
    }

    // Priority 3: Select questions answered by others
    if (answeredByOthersOnly) {
      const answeredQuestions = questions.filter(
        (q) => q.answeredBySelf && isUniqueUserQuestion(q)
      )
      if (answeredQuestions.length > 0) {
        return answeredQuestions[
          Math.floor(Math.random() * answeredQuestions.length)
        ]
      }
    }
  }

  const weightedQuestions = questions.map((question) => {
    let weight = Math.random()
    if (question.answeredBySelf) weight += 1
    if (
      question.quizId === currentQuestion?.quizId &&
      question.selfId === currentQuestion?.selfId
    ) {
      weight += 1
    }
    return { question, weight }
  })

  // find question with highest weight
  let maxWeight = -1
  let selectedQuestion = null
  for (const { question, weight } of weightedQuestions) {
    if (weight > maxWeight) {
      maxWeight = weight
      selectedQuestion = question
    }
  }

  // Fallback: return the last unique question (this should rarely happen)
  return selectedQuestion || null
}
