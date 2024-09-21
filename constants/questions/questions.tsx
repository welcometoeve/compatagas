import { badPersonQuestions, badPersonQuiz } from "./badPersonPack"
import { chadQuestions, chadQuiz } from "./chadPack"
import { charlesStreetQuestions, charlesStreetQuiz } from "./charleStreetPack"
import { goodStudentQuestions, goodStudentQuiz } from "./goodStudentPack"
import { musicQuestions, musicQuiz } from "./musicPack"
import { neighborQuestions, NeighborQuiz } from "./neighborPack"
import { pettyQuestions, pettyQuiz } from "./pettyPack"
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
  ...pettyQuestions,
]

export const quizzes: Quiz[] = [
  charlesStreetQuiz,
  pettyQuiz,

  goodStudentQuiz,
  NeighborQuiz,
  badPersonQuiz,
  styleQuiz,
  musicQuiz,
  chadQuiz,
]

export function insertName(text: string, name: string): string {
  return text.replace(/\{name\}/g, name)
}
