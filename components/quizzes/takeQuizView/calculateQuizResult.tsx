import { FriendAnswer } from "@/contexts/FriendAnswerContext"
import { SelfAnswer } from "./TakeQuizView"
import { questions, Side } from "@/components/questions"

export default function calculateQuizResult(
  answers: (FriendAnswer | SelfAnswer)[]
) {
  return (
    (answers
      .map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId)
        if (!question) return 0
        const option = question.options[answer.optionIndex]
        return (option.side === Side.LEFT ? -1 : Side.RIGHT ? 1 : 0) as number
      })
      .reduce((acc, val) => acc + val, 0) /
      questions.filter((q) => q.quizId === answers[0].quizId).length) *
    100
  )
}
