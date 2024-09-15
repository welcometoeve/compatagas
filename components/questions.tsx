import { ImageSourcePropType } from "react-native"

export type Quiz = {
  id: number
  name: string
  src: ImageSourcePropType
  leftLabel: string
  rightLabel: string
}

export enum Side {
  LEFT,
  RIGHT,
  NEITHER,
}

export type Question = {
  id: number
  secondPersonLabel: string
  thirdPersonLabel: string
  options: { label: string; side: Side }[]
  quizId: number
}

export const musicQuiz: Quiz = {
  id: 3,
  name: "How Basic is Your Music Taste?",
  src: require("../assets/images/musicQuiz.webp"),
  leftLabel: "Not Basic",
  rightLabel: "Basic",
}

export const chadQuiz: Quiz = {
  id: 4,
  name: "How Chad are You?",
  src: require("../assets/images/chadQuiz.webp"),
  leftLabel: "Not Chad",
  rightLabel: "Chad",
}

export const musicQuestions: Question[] = [
  {
    id: 17,
    secondPersonLabel:
      "Walking Spotify algorithm or still figuring out who Chapell Roan is?",
    thirdPersonLabel:
      "Walking Spotify algorithm or still figuring out who Chapell Roan is?",
    options: [
      { label: "Walking Spotify algorithm 🎧", side: Side.LEFT },
      { label: "Still figuring out who Chapell Roan is 🤔", side: Side.RIGHT },
    ],
    quizId: 3,
  },
  {
    id: 18,
    secondPersonLabel: "DJ of the friend group or banned from AUX?",
    thirdPersonLabel: "DJ of the friend group or banned from AUX?",
    options: [
      { label: "DJ of the friend group 🎉", side: Side.LEFT },
      { label: "Banned from AUX 🚫", side: Side.RIGHT },
    ],
    quizId: 3,
  },
  {
    id: 19,
    secondPersonLabel:
      "Connoisseur of niche artists, top 1% of Taylor Swift listeners, or somewhere in between?",
    thirdPersonLabel:
      "Connoisseur of niche artists, top 1% of Taylor Swift listeners, or somewhere in between?",
    options: [
      { label: "Connoisseur of niche artists 🎵", side: Side.LEFT },
      { label: "Top 1% of Taylor Swift listeners 🎤", side: Side.RIGHT },
      { label: "Somewhere in between 🤷", side: Side.NEITHER },
    ],
    quizId: 3,
  },
  {
    id: 20,
    secondPersonLabel: "Spotify Surfer or Tiktok top 100 ONLY?",
    thirdPersonLabel: "Spotify Surfer or Tiktok top 100 ONLY?",
    options: [
      { label: "Spotify Surfer 🏄", side: Side.LEFT },
      { label: "Tiktok top 100 ONLY 📱", side: Side.RIGHT },
    ],
    quizId: 3,
  },
  {
    id: 21,
    secondPersonLabel: "Music experimentalist or sticks to what they know?",
    thirdPersonLabel: "Music experimentalist or sticks to what they know?",
    options: [
      { label: "Music experimentalist 🧪", side: Side.LEFT },
      { label: "Sticks to what they know 🔁", side: Side.RIGHT },
    ],
    quizId: 3,
  },
  {
    id: 22,
    secondPersonLabel: "What's your favorite genre?",
    thirdPersonLabel: "What's their favorite genre?",
    options: [
      { label: "Hip hop/Pop 🎤", side: Side.RIGHT },
      { label: "Rock 🎸", side: Side.NEITHER },
      { label: "EDM 🎛️", side: Side.NEITHER },
      { label: "R&B 🎶", side: Side.NEITHER },
      { label: "Indie 🎹", side: Side.NEITHER },
    ],
    quizId: 3,
  },
]

export const chadQuestions: Question[] = [
  {
    id: 23,
    secondPersonLabel: "Casual mewer, pro mogger, or not a looksmaxxer?",
    thirdPersonLabel: "Casual mewer, pro mogger, or not a looksmaxxer?",
    options: [
      { label: "Casual mewer 😼", side: Side.NEITHER },
      { label: "Pro mogger 💪", side: Side.RIGHT },
      { label: "Not a looksmaxxer 🤷", side: Side.LEFT },
    ],
    quizId: 4,
  },
  {
    id: 24,
    secondPersonLabel: "Gym rat or sofa sergeant?",
    thirdPersonLabel: "Gym rat or sofa sergeant?",
    options: [
      { label: "Gym rat 🏋️", side: Side.RIGHT },
      { label: "Sofa sergeant 🛋️", side: Side.LEFT },
    ],
    quizId: 4,
  },
  {
    id: 25,
    secondPersonLabel: "Beast mode or feast mode?",
    thirdPersonLabel: "Beast mode or feast mode?",
    options: [
      { label: "Beast mode 💪", side: Side.RIGHT },
      { label: "Feast mode 🍔", side: Side.LEFT },
    ],
    quizId: 4,
  },
  {
    id: 26,
    secondPersonLabel: "Social butterfly or keyboard warrior?",
    thirdPersonLabel: "Social butterfly or keyboard warrior?",
    options: [
      { label: "Social butterfly 🦋", side: Side.RIGHT },
      { label: "Keyboard warrior ⌨️", side: Side.LEFT },
    ],
    quizId: 4,
  },
  {
    id: 27,
    secondPersonLabel: "Rizz master or shy guy?",
    thirdPersonLabel: "Rizz master or shy guy?",
    options: [
      { label: "Rizz master 😎", side: Side.RIGHT },
      { label: "Shy guy 🙈", side: Side.LEFT },
    ],
    quizId: 4,
  },
  {
    id: 28,
    secondPersonLabel: "Sigma or simp?",
    thirdPersonLabel: "Sigma or simp?",
    options: [
      { label: "Sigma 🐺", side: Side.RIGHT },
      { label: "Simp 🥺", side: Side.LEFT },
    ],
    quizId: 4,
  },
  {
    id: 29,
    secondPersonLabel: "Which do you prefer on a Friday night?",
    thirdPersonLabel: "Which do they prefer on a Friday night?",
    options: [
      { label: "Rager with da boyz 🎉", side: Side.RIGHT },
      { label: "Quiet night in 🏠", side: Side.LEFT },
    ],
    quizId: 4,
  },
]

export const quizzes: Quiz[] = [musicQuiz, chadQuiz]
export const questions: Question[] = [...musicQuestions, ...chadQuestions]
