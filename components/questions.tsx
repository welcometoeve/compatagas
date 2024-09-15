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
  secondPersonLabel: string
  thirdPersonLabel: string
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

const assignSide = (index: number, totalOptions: number): Side =>
  index < Math.ceil(totalOptions / 2) ? Side.LEFT : Side.RIGHT

export const basicQuestions: Question[] = [
  {
    id: 1,
    secondPersonLabel: "What's your favorite season?",
    thirdPersonLabel: "What's their favorite season?",
    options: [
      { label: "Spring 🌸", side: assignSide(0, 4) },
      { label: "Summer ☀️", side: assignSide(1, 4) },
      { label: "Fall 🍂", side: assignSide(2, 4) },
      { label: "Winter ❄️", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
  {
    id: 2,
    secondPersonLabel: "Choose a hobby for yourself:",
    thirdPersonLabel: "Choose a hobby for them:",
    options: [
      { label: "Reading 📚", side: assignSide(0, 4) },
      { label: "Sports 🏀", side: assignSide(1, 4) },
      { label: "Cooking 🍳", side: assignSide(2, 4) },
      { label: "Painting 🎨", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
  {
    id: 3,
    secondPersonLabel: "Pick a superpower for yourself:",
    thirdPersonLabel: "Pick a superpower for them:",
    options: [
      { label: "Flight ✈️", side: assignSide(0, 4) },
      { label: "Invisibility 👻", side: assignSide(1, 4) },
      { label: "Super strength 💪", side: assignSide(2, 4) },
      { label: "Teleportation 🚀", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
  {
    id: 4,
    secondPersonLabel: "Your favorite type of music?",
    thirdPersonLabel: "Their favorite type of music?",
    options: [
      { label: "Pop 🎵", side: assignSide(0, 4) },
      { label: "Rock 🎸", side: assignSide(1, 4) },
      { label: "Classical 🎻", side: assignSide(2, 4) },
      { label: "Hip-hop 🎤", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
  {
    id: 5,
    secondPersonLabel: "What's your dream vacation?",
    thirdPersonLabel: "What's their dream vacation?",
    options: [
      { label: "Beach getaway 🏖️", side: assignSide(0, 4) },
      { label: "Mountain adventure 🏔️", side: assignSide(1, 4) },
      { label: "City exploration 🏙️", side: assignSide(2, 4) },
      { label: "Jungle expedition 🌴", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
  {
    id: 6,
    secondPersonLabel: "Choose a pet for yourself:",
    thirdPersonLabel: "Choose a pet for them:",
    options: [
      { label: "Dog 🐕", side: assignSide(0, 4) },
      { label: "Cat 🐈", side: assignSide(1, 4) },
      { label: "Fish 🐠", side: assignSide(2, 4) },
      { label: "Bird 🦜", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
  {
    id: 7,
    secondPersonLabel: "Your preferred mode of transportation?",
    thirdPersonLabel: "Their preferred mode of transportation?",
    options: [
      { label: "Car 🚗", side: assignSide(0, 4) },
      { label: "Bike 🚲", side: assignSide(1, 4) },
      { label: "Public transit 🚌", side: assignSide(2, 4) },
      { label: "Walking 👟", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
  {
    id: 8,
    secondPersonLabel: "Pick your ideal weekend activity:",
    thirdPersonLabel: "Pick their ideal weekend activity:",
    options: [
      { label: "Movie marathon 🍿", side: assignSide(0, 4) },
      { label: "Outdoor picnic 🧺", side: assignSide(1, 4) },
      { label: "Video gaming 🎮", side: assignSide(2, 4) },
      { label: "Spa day 💆", side: assignSide(3, 4) },
    ],
    quizId: 1,
  },
]

export const hornyQuestions: Question[] = [
  {
    id: 9,
    secondPersonLabel: "Perpetually horny or a nun or a perpetually horny nun?",
    thirdPersonLabel: "Perpetually horny or nun or perpetually horny nun?",
    options: [
      { label: "Nun 🙏", side: assignSide(0, 3) },
      { label: "Perpetually horny 😈", side: assignSide(1, 3) },
      { label: "Perpetually horny nun 😇😈", side: assignSide(2, 3) },
    ],
    quizId: 2,
  },
  {
    id: 10,
    secondPersonLabel:
      "Eat a sandwich or get walked around on a leash like a dog?",
    thirdPersonLabel:
      "Eat a sandwich or get walked around on a leash like a dog?",
    options: [
      { label: "Eat a sandwich 🥪", side: assignSide(0, 2) },
      { label: "Get walked on a leash 🐕", side: assignSide(1, 2) },
    ],
    quizId: 2,
  },
  {
    id: 11,
    secondPersonLabel: "From the front or from the back?",
    thirdPersonLabel: "From the front or from the back?",
    options: [
      { label: "From the front 😊", side: assignSide(0, 2) },
      { label: "From the back 😏", side: assignSide(1, 2) },
    ],
    quizId: 2,
  },
  {
    id: 12,
    secondPersonLabel: "Church or dropping it like a thotty?",
    thirdPersonLabel: "Church or dropping it like a thotty?",
    options: [
      { label: "Church 🙏", side: assignSide(0, 2) },
      { label: "Dropping it like a thotty 💃", side: assignSide(1, 2) },
    ],
    quizId: 2,
  },
  {
    id: 13,
    secondPersonLabel: "Classified camera roll or open book?",
    thirdPersonLabel: "Classified camera roll or open book?",
    options: [
      { label: "Open book 📖", side: assignSide(0, 2) },
      { label: "Classified camera roll 🔒", side: assignSide(1, 2) },
    ],
    quizId: 2,
  },
  {
    id: 14,
    secondPersonLabel: "Sex on the first date or leaving room for Jesus?",
    thirdPersonLabel: "Sex on the first date or leave room for Jesus?",
    options: [
      { label: "Leave room for Jesus 🙏", side: assignSide(0, 2) },
      { label: "Sex on the first date 😘", side: assignSide(1, 2) },
    ],
    quizId: 2,
  },
  {
    id: 15,
    secondPersonLabel: "Do whips and chains excite you?",
    thirdPersonLabel: "Do whips and chains excite you?",
    options: [
      { label: "No 🚫", side: assignSide(0, 2) },
      { label: "Yes 🔗", side: assignSide(1, 2) },
    ],
    quizId: 2,
  },
  {
    id: 16,
    secondPersonLabel: "Sending selfies or sending feet pics?",
    thirdPersonLabel: "Sending selfies or sending feet pics?",
    options: [
      { label: "Sending selfies 🤳", side: assignSide(0, 2) },
      { label: "Sending feet pics 🦶", side: assignSide(1, 2) },
    ],
    quizId: 2,
  },
]

export const quizzes: Quiz[] = [basicQuiz, hornyQuiz]
export const questions: Question[] = [...basicQuestions, ...hornyQuestions]
