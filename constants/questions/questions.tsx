import { badPersonQuestions, badPersonQuiz } from "./badPersonPack"
import { chadQuestions, chadQuiz } from "./chadPack"
import { charlesStreetQuestions, charlesStreetQuiz } from "./charleStreetPack"
import { goodStudentQuestions, goodStudentQuiz } from "./goodStudentPack"
import { musicQuestions, musicQuiz } from "./musicPack"
import { neighborQuestions, NeighborQuiz } from "./neighborPack"
import { styleQuestions, styleQuiz } from "./stylePack"
import { Question, Quiz } from "./types"

export const questions: Question[] = [
  ...styleQuestions,
  ...badPersonQuestions,
  ...goodStudentQuestions,
  ...musicQuestions,
  ...chadQuestions,
  ...neighborQuestions,
  ...charlesStreetQuestions,
]

export const quizzes: Quiz[] = [
  charlesStreetQuiz,
  goodStudentQuiz,
  badPersonQuiz,
  NeighborQuiz,
  styleQuiz,
  musicQuiz,
  chadQuiz,
]

export function insertName(text: string, name: string): string {
  return text.replace(/\{name\}/g, name)
}
