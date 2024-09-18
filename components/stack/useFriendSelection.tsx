import { useState, useMemo, useCallback } from "react"
import { Question, questions, quizzes } from "../../constants/questions"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useUser } from "@/contexts/UserContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"

interface CardState {
  currentFriendId: number | null
  currentQuestionId: number | null
  nextFriendId: number | null
  nextQuestionId: number | null
}

export const useFriendQuestionSelection = () => {
  const { friendAnswers } = useFriendAnswers()
  const { user, allUsers } = useUser()
  const { selfAnswers } = useSelfAnswers()

  const [cardState, setCardState] = useState<CardState>({
    currentFriendId: null,
    currentQuestionId: null,
    nextFriendId: null,
    nextQuestionId: null,
  })

  const [currentQuizUserCombo, setCurrentQuizUserCombo] = useState<{
    quizId: number
    selfId: number
  } | null>(null)

  const friends = useMemo(
    () => allUsers.filter((u) => u.id !== user?.id),
    [allUsers, user]
  )
  const availableQuestions: Question[] = questions
  const filteredFriendAnswers = useMemo(
    () => friendAnswers.filter((answer) => answer.friendId === user?.id),
    [friendAnswers, user]
  )

  const quizUserCombos = useMemo(() => {
    return quizzes.flatMap((quiz) => {
      return allUsers.map((user) => {
        return { quizId: quiz.id, selfId: user.id }
      })
    })
  }, [quizzes, allUsers])

  const incompleteQuizUserCombos = useMemo(() => {
    return quizUserCombos.filter(({ quizId, selfId }) => {
      const relevantSelfAnswers = selfAnswers.filter(
        (sa) =>
          sa.quizId === quizId && sa.userId === selfId && sa.userId != user?.id
      )
      const relevantFriendAnswers = friendAnswers.filter(
        (fa) =>
          fa.quizId === quizId &&
          fa.selfId === selfId &&
          fa.friendId === user?.id
      )
      const relevantQuestions = questions.filter((q) => q.quizId === quizId)
      return (
        relevantQuestions.length <= relevantSelfAnswers.length &&
        relevantQuestions.length > relevantFriendAnswers.length
      )
    })
  }, [quizUserCombos, selfAnswers, friendAnswers, questions, user])

  const selectNextQuizUserCombo = useCallback(() => {
    if (incompleteQuizUserCombos.length > 0) {
      return incompleteQuizUserCombos[0]
    }
    return null
  }, [incompleteQuizUserCombos])

  const selectRandomFriend = useCallback(() => {
    const availableFriends = friends.filter((friend) =>
      availableQuestions.some(
        (q) =>
          !filteredFriendAnswers.some(
            (a) => a.selfId === friend.id && a.questionId === q.id
          )
      )
    )

    if (availableFriends.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableFriends.length)
      return availableFriends[randomIndex].id
    }
    return null
  }, [friends, availableQuestions, filteredFriendAnswers])

  const selectQuestion = useCallback(
    (friendId: number, currentQuestionId: number | null) => {
      const unansweredQuestions = availableQuestions.filter(
        (q) =>
          !filteredFriendAnswers.some(
            (a) => a.selfId === friendId && a.questionId === q.id
          ) &&
          q.id !== currentQuestionId &&
          (currentQuizUserCombo
            ? q.quizId === currentQuizUserCombo.quizId
            : true)
      )
      if (unansweredQuestions.length > 0) {
        return unansweredQuestions[0].id
      }
      return null
    },
    [availableQuestions, filteredFriendAnswers, currentQuizUserCombo]
  )

  const selectNewFriendAndQuestion = useCallback(() => {
    if (!currentQuizUserCombo) {
      const newCombo = selectNextQuizUserCombo()
      if (newCombo) {
        setCurrentQuizUserCombo(newCombo)
        const newQuestionId = selectQuestion(newCombo.selfId, null)
        return { newFriendId: newCombo.selfId, newQuestionId }
      }
    }

    if (currentQuizUserCombo) {
      const newQuestionId = selectQuestion(
        currentQuizUserCombo.selfId,
        cardState.currentQuestionId
      )
      if (newQuestionId) {
        return {
          newFriendId: currentQuizUserCombo.selfId,
          newQuestionId,
        }
      } else {
        // Current quiz is completed, move to the next one
        const newCombo = selectNextQuizUserCombo()
        if (newCombo) {
          setCurrentQuizUserCombo(newCombo)
          const newQuestionId = selectQuestion(newCombo.selfId, null)
          return { newFriendId: newCombo.selfId, newQuestionId }
        }
      }
    }

    // If no incomplete quizzes, fall back to random selection
    const newFriendId = selectRandomFriend()
    if (newFriendId !== null) {
      const newQuestionId = selectQuestion(
        newFriendId,
        cardState.currentQuestionId
      )
      return { newFriendId, newQuestionId }
    }
    return null
  }, [
    currentQuizUserCombo,
    cardState,
    selectNextQuizUserCombo,
    selectQuestion,
    selectRandomFriend,
  ])

  return {
    cardState,
    setCardState,
    selectNewFriendAndQuestion,
    friends,
    availableQuestions,
    filteredFriendAnswers,
  }
}
