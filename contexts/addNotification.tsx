import { questions } from "@/components/questions"
import { FriendAnswer } from "./FriendAnswerContext"
import { SelfAnswer } from "./SelfAnswerContext"
import { UserProfile } from "./UserContext"
import collect from "@/components/collect"
import { CustomNotification } from "./NotificationContext"

export async function addSelfAnswerInitiatedNotification(
  quizId: number,
  friendAnswers: FriendAnswer[],
  user: UserProfile,
  addNotification: (
    selfId: number,
    friendId: number,
    quizId: number
  ) => Promise<CustomNotification | null>
): Promise<number[]> {
  // friend ids
  const numQuestionsInThisQuiz = questions.filter(
    (q) => q.quizId === quizId
  ).length

  const completedFriendQuizzes = collect(friendAnswers, [
    "quizId",
    "selfId",
    "friendId",
  ])
    .filter((g) => g.length >= numQuestionsInThisQuiz)
    .map((g) => ({
      quizId: g[0].quizId,
      selfId: g[0].selfId,
      friendId: g[0].friendId,
    }))
    .filter((q) => q.selfId === user.id && q.quizId === quizId)

  completedFriendQuizzes.forEach(async (q) => {
    const selfId = q.selfId
    const friendId = q.friendId
    const quizId = q.quizId

    await addNotification(selfId, friendId, quizId)
  })

  return completedFriendQuizzes.map((q) => q.friendId)
}

export function addFriendAnswerInitiatedNotification(
  friendAnswers: FriendAnswer[],
  selfAnswers: SelfAnswer[],
  quizId: number,
  selfId: number,
  friendId: number,
  addNotification: (
    selfId: number,
    friendId: number,
    quizId: number
  ) => Promise<CustomNotification | null>
): number | undefined {
  // selfId
  const numFriendAnswersForThisQuiz =
    friendAnswers.filter(
      (q) =>
        q.quizId === quizId && friendId === q.friendId && selfId === q.selfId
    ).length + 1 // for new answer

  const numQuestionsInThisQuiz = questions.filter(
    (q) => q.quizId === quizId
  ).length
  const numSelfAnswers = selfAnswers.filter(
    (sa) => sa.userId === selfId && sa.quizId === quizId
  ).length

  if (
    numQuestionsInThisQuiz <= numFriendAnswersForThisQuiz &&
    numQuestionsInThisQuiz <= numSelfAnswers
  ) {
    addNotification(selfId, friendId, quizId)
    return selfId
  } else {
    return undefined
  }
}
