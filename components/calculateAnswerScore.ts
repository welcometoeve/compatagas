import { SelfAnswer } from "@/contexts/SelfAnswerContext"
import { Question, Side } from "./questions"
import { FriendAnswer } from "@/contexts/FriendAnswerContext"

function calculateAnswerScore(
  question: Question,
  answer: SelfAnswer | FriendAnswer
): number {
  const selectedOption = question.options[answer.optionIndex]

  // Convert Side to a number value
  const sideValue = selectedOption.side === Side.LEFT ? -1 : 1

  // Calculate the position within the side
  const positionWithinSide =
    answer.optionIndex / (question.options.length / 2 - 1)

  // Interpolate between -1 and 0 for LEFT, or 0 and 1 for RIGHT
  return sideValue * positionWithinSide
}

export function calculateQuizResult(
  questions: Question[],
  answers: SelfAnswer[]
): number {
  let totalScore = 0
  let answeredQuestions = 0

  for (const question of questions) {
    const answer = answers.find((a) => a.questionId === question.id)
    if (answer) {
      totalScore += calculateAnswerScore(question, answer)
      answeredQuestions++
    }
  }

  // Return the average score, or 0 if no questions were answered
  return answeredQuestions > 0 ? totalScore / answeredQuestions : 0
}
