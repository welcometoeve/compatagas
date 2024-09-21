import { questions } from "@/constants/questions/questions"
import { FriendAnswer } from "../FriendAnswerContext"
import { SelfAnswer } from "../SelfAnswerContext"
import { UserProfile } from "../UserContext"
import collect from "@/components/collect"
import { CustomNotification } from "./NotificationContext"
import { createClient } from "@supabase/supabase-js"
import { SupabaseKey, SupabaseUrl } from "@/constants/constants"

const supabase = createClient(SupabaseUrl, SupabaseKey)

export async function addSelfAnswerInitiatedNotification(
  quizId: number,
  friendAnswers: FriendAnswer[],
  user: UserProfile,
  friends: UserProfile[],
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

    const selfUser = friends.find((u) => u.id === selfId)
    await addNotification(selfId, friendId, quizId)
    await sendNotification(
      friendId.toString(),
      "New Pack Results!",
      `${selfUser?.name}'s pack results are available.`,
      selfUser?.notificationToken
    )
  })

  return completedFriendQuizzes.map((q) => q.friendId)
}

export function addFriendAnswerInitiatedNotification(
  friends: UserProfile[],
  friendAnswers: FriendAnswer[],
  selfAnswers: SelfAnswer[],
  quizId: number,
  selfId: number,
  friendId: number,
  notifications: CustomNotification[],
  addNotification: (
    selfId: number,
    friendId: number,
    quizId: number
  ) => Promise<CustomNotification | null>
): { friendId: number; quizId: number } | undefined {
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

  const existingNotification = notifications.find(
    (n) => n.selfId === selfId && n.friendId === friendId && n.quizId === quizId
  )

  if (
    numQuestionsInThisQuiz <= numFriendAnswersForThisQuiz &&
    numQuestionsInThisQuiz <= numSelfAnswers &&
    !existingNotification
  ) {
    const selfUser = friends.find((u) => u.id === selfId)
    addNotification(selfId, friendId, quizId)
    sendNotification(
      selfId.toString(),
      "New Pack Results!",
      `Someone has answered one of your packs.`,
      selfUser?.notificationToken
    )

    return { friendId: selfId, quizId }
  } else {
    return undefined
  }
}

async function sendNotification(
  recipientId: string,
  title: string,
  message: string,
  notificationToken?: string
) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "send-notification",
      {
        body: JSON.stringify({
          recipientId,
          title,
          message,
          notificationToken,
        }),
      }
    )

    if (error) throw error

    console.log("Notification sent successfully:", data)
    return data
  } catch (error) {
    console.error("Error sending notification:", error)
    throw error
  }
}
