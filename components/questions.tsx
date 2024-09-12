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
}

export type Question = {
  id: number
  label: string
  options: { label: string; side: Side }[]
  quizId: number
}

export const basicQuiz: Quiz = {
  id: 1,
  name: "Basic Quiz",
  src: require("../assets/images/basicQuiz.webp"),
  leftLabel: "Not Basic",
  rightLabel: "Basic",
}

export const hornyQuiz: Quiz = {
  id: 2,
  name: "Horny Quiz",
  src: require("../assets/images/hornyQuiz.webp"),
  leftLabel: "Not Horny",
  rightLabel: "Horny",
}

const randomizeSide = (): Side => (Math.random() < 0.5 ? Side.LEFT : Side.RIGHT)

export const basicQuestions: Question[] = [
  {
    id: 1,
    label: "What's their favorite season?",
    options: [
      { label: "Spring 🌸", side: randomizeSide() },
      { label: "Summer ☀️", side: randomizeSide() },
      { label: "Fall 🍂", side: randomizeSide() },
      { label: "Winter ❄️", side: randomizeSide() },
    ],
    quizId: 1,
  },
  {
    id: 2,
    label: "Choose a hobby for them:",
    options: [
      { label: "Reading 📚", side: randomizeSide() },
      { label: "Sports 🏀", side: randomizeSide() },
      { label: "Cooking 🍳", side: randomizeSide() },
      { label: "Painting 🎨", side: randomizeSide() },
    ],
    quizId: 1,
  },
  {
    id: 3,
    label: "Pick a superpower for them:",
    options: [
      { label: "Flight ✈️", side: randomizeSide() },
      { label: "Invisibility 👻", side: randomizeSide() },
      { label: "Super strength 💪", side: randomizeSide() },
      { label: "Teleportation 🚀", side: randomizeSide() },
    ],
    quizId: 1,
  },
  {
    id: 4,
    label: "Their favorite type of music?",
    options: [
      { label: "Pop 🎵", side: randomizeSide() },
      { label: "Rock 🎸", side: randomizeSide() },
      { label: "Classical 🎻", side: randomizeSide() },
      { label: "Hip-hop 🎤", side: randomizeSide() },
    ],
    quizId: 1,
  },
  {
    id: 5,
    label: "What's their dream vacation?",
    options: [
      { label: "Beach getaway 🏖️", side: randomizeSide() },
      { label: "Mountain adventure 🏔️", side: randomizeSide() },
      { label: "City exploration 🏙️", side: randomizeSide() },
      { label: "Jungle expedition 🌴", side: randomizeSide() },
    ],
    quizId: 1,
  },
  {
    id: 6,
    label: "Choose a pet for them:",
    options: [
      { label: "Dog 🐕", side: randomizeSide() },
      { label: "Cat 🐈", side: randomizeSide() },
      { label: "Fish 🐠", side: randomizeSide() },
      { label: "Bird 🦜", side: randomizeSide() },
    ],
    quizId: 1,
  },
  {
    id: 7,
    label: "Their preferred mode of transportation?",
    options: [
      { label: "Car 🚗", side: randomizeSide() },
      { label: "Bike 🚲", side: randomizeSide() },
      { label: "Public transit 🚌", side: randomizeSide() },
      { label: "Walking 👟", side: randomizeSide() },
    ],
    quizId: 1,
  },
  {
    id: 8,
    label: "Pick their ideal weekend activity:",
    options: [
      { label: "Movie marathon 🍿", side: randomizeSide() },
      { label: "Outdoor picnic 🧺", side: randomizeSide() },
      { label: "Video gaming 🎮", side: randomizeSide() },
      { label: "Spa day 💆", side: randomizeSide() },
    ],
    quizId: 1,
  },
]

export const hornyQuestions: Question[] = [
  {
    id: 9,
    label: "Perpetually horny or nun or perpetually horny nun?",
    options: [
      { label: "Nun 🙏", side: randomizeSide() },
      { label: "Perpetually horny 😈", side: randomizeSide() },
      { label: "Perpetually horny nun 😇😈", side: randomizeSide() },
    ],
    quizId: 2,
  },
  {
    id: 10,
    label: "Eat a sandwich or get walked around on a leash like a dog?",
    options: [
      { label: "Eat a sandwich 🥪", side: randomizeSide() },
      { label: "Get walked on a leash 🐕", side: randomizeSide() },
    ],
    quizId: 2,
  },
  {
    id: 11,
    label: "From the front or from the back?",
    options: [
      { label: "From the front 😊", side: randomizeSide() },
      { label: "From the back 😏", side: randomizeSide() },
    ],
    quizId: 2,
  },
  {
    id: 12,
    label: "Church or dropping it like a thotty?",
    options: [
      { label: "Church 🙏", side: randomizeSide() },
      { label: "Dropping it like a thotty 💃", side: randomizeSide() },
    ],
    quizId: 2,
  },
  {
    id: 13,
    label: "Classified camera roll or open book?",
    options: [
      { label: "Open book 📖", side: randomizeSide() },
      { label: "Classified camera roll 🔒", side: randomizeSide() },
    ],
    quizId: 2,
  },
  {
    id: 14,
    label: "Sex on the first date or leave room for Jesus?",
    options: [
      { label: "Leave room for Jesus 🙏", side: randomizeSide() },
      { label: "Sex on the first date 😘", side: randomizeSide() },
    ],
    quizId: 2,
  },
  {
    id: 15,
    label: "Do whips and chains excite you?",
    options: [
      { label: "No 🚫", side: randomizeSide() },
      { label: "Yes 🔗", side: randomizeSide() },
    ],
    quizId: 2,
  },
  {
    id: 16,
    label: "Sending selfies or sending feet pics?",
    options: [
      { label: "Sending selfies 🤳", side: randomizeSide() },
      { label: "Sending feet pics 🦶", side: randomizeSide() },
    ],
    quizId: 2,
  },
]

export const quizzes: Quiz[] = [basicQuiz, hornyQuiz]
export const questions: Question[] = [...basicQuestions, ...hornyQuestions]
