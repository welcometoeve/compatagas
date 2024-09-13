import { FriendAnswer } from "@/contexts/FriendAnswerContext"
import { SelfAnswer } from "@/contexts/SelfAnswerContext"
import { Question, Quiz } from "./questions"
import collect from "./collect"

interface QuizListItem {
  quiz: Quiz
  theirIds: number[]
}

export default function processQuizLists(
  friendAnswers: FriendAnswer[],
  selfAnswers: SelfAnswer[],
  quizzes: Quiz[],
  questions: Question[],
  userId: number
): { yourQuizzes: QuizListItem[]; theirQuizzes: QuizListItem[] } {
  const selfQuizzes = collect(selfAnswers, ["quizId", "userId"]).map(
    (answers) => ({ quizId: answers[0].quizId, userId: answers[0].userId })
  )

  const quizCounts = collect(selfQuizzes, ["quizId"]).map((quiz) => ({
    quizId: quiz[0].quizId,
    count: quiz.length,
  }))

  const friendQuizzes = collect(friendAnswers, [
    "quizId",
    "selfId",
    "friendId",
  ]).map((answers) => ({
    quizId: answers[0].quizId,
    selfId: answers[0].selfId,
    friendId: answers[0].friendId,
  }))

  const completedSelfQuizzes = selfQuizzes.filter(
    (q) =>
      quizCounts.find((qc) => qc.quizId >= q.quizId)?.count ??
      0 >= questions.filter((q) => q.quizId === q.quizId).length
  )
  const completedFriendQuizzes = friendQuizzes.filter(
    (q) =>
      quizCounts.find((qc) => qc.quizId >= q.quizId)?.count ??
      0 >= questions.filter((q) => q.quizId === q.quizId).length
  )

  const quizzesYouCompletedAboutYourself = completedSelfQuizzes.filter(
    (q) => q.userId === userId
  )

  const quizzesYouCompletedAboutYourFriends = completedFriendQuizzes.filter(
    (q) => q.friendId === userId
  )

  const quizzesYourFriendsCompletedAboutYou = completedFriendQuizzes.filter(
    (q) => q.selfId === userId
  )

  const yourQuizzes = quizzesYouCompletedAboutYourself
    .map((q) => ({
      quiz: quizzes.find((quiz) => quiz.id === q.quizId)!,
      theirIds: quizzesYourFriendsCompletedAboutYou
        .filter((f) => f.quizId === q.quizId)
        .map((f) => f.friendId),
    }))
    .filter((q) => q.theirIds.length > 0)

  const theirQuizzes = quizzesYouCompletedAboutYourFriends.map((q) => ({
    quiz: quizzes.find((quiz) => quiz.id === q.quizId)!,
    theirIds: [q.selfId],
  }))

  return { yourQuizzes, theirQuizzes }
}
