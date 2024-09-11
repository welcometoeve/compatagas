export type Quiz = {
  id: number
  name: string
}

export type Question = {
  id: number
  label: string
  options: string[]
  quizId: number
}

export const basicQuiz: Quiz = {
  id: 1,
  name: "Basic Quiz",
}

export const hornyQuiz: Quiz = {
  id: 2,
  name: "Horny Quiz",
}

export const basicQuestions: Question[] = [
  {
    id: 1,
    label: "What's their favorite season?",
    options: ["Spring 🌸", "Summer ☀️", "Fall 🍂", "Winter ❄️"],
    quizId: 1,
  },
  {
    id: 2,
    label: "Choose a hobby for them:",
    options: ["Reading 📚", "Sports 🏀", "Cooking 🍳", "Painting 🎨"],
    quizId: 1,
  },
  {
    id: 3,
    label: "Pick a superpower for them:",
    options: [
      "Flight ✈️",
      "Invisibility 👻",
      "Super strength 💪",
      "Teleportation 🚀",
    ],
    quizId: 1,
  },
  {
    id: 4,
    label: "Their favorite type of music?",
    options: ["Pop 🎵", "Rock 🎸", "Classical 🎻", "Hip-hop 🎤"],
    quizId: 1,
  },
  {
    id: 5,
    label: "What's their dream vacation?",
    options: [
      "Beach getaway 🏖️",
      "Mountain adventure 🏔️",
      "City exploration 🏙️",
      "Jungle expedition 🌴",
    ],
    quizId: 1,
  },
  {
    id: 6,
    label: "Choose a pet for them:",
    options: ["Dog 🐕", "Cat 🐈", "Fish 🐠", "Bird 🦜"],
    quizId: 1,
  },
  {
    id: 7,
    label: "Their preferred mode of transportation?",
    options: ["Car 🚗", "Bike 🚲", "Public transit 🚌", "Walking 👟"],
    quizId: 1,
  },
  {
    id: 8,
    label: "Pick their ideal weekend activity:",
    options: [
      "Movie marathon 🍿",
      "Outdoor picnic 🧺",
      "Video gaming 🎮",
      "Spa day 💆",
    ],
    quizId: 1,
  },
]

export const hornyQuestions: Question[] = [
  {
    id: 9,
    label: "Perpetually horny or nun or perpetually horny nun?",
    options: ["Nun 🙏", "Perpetually horny 😈", "Perpetually horny nun 😇😈"],
    quizId: 2,
  },
  {
    id: 10,
    label: "Eat a sandwich or get walked around on a leash like a dog?",
    options: ["Eat a sandwich 🥪", "Get walked on a leash 🐕"],
    quizId: 2,
  },
  {
    id: 11,
    label: "From the front or from the back?",
    options: ["From the front 😊", "From the back 😏"],
    quizId: 2,
  },
  {
    id: 12,
    label: "Church or dropping it like a thotty?",
    options: ["Church 🙏", "Dropping it like a thotty 💃"],
    quizId: 2,
  },
  {
    id: 13,
    label: "Classified camera roll or open book?",
    options: ["Open book 📖", "Classified camera roll 🔒"],
    quizId: 2,
  },
  {
    id: 14,
    label: "Sex on the first date or leave room for Jesus?",
    options: ["Leave room for Jesus 🙏", "Sex on the first date 😘"],
    quizId: 2,
  },
  {
    id: 15,
    label: "Do whips and chains excite you?",
    options: ["No 🚫", "Yes 🔗"],
    quizId: 2,
  },
  {
    id: 16,
    label: "Sending selfies or sending feet pics?",
    options: ["Sending selfies 🤳", "Sending feet pics 🦶"],
    quizId: 2,
  },
]

export const quizzes: Quiz[] = [basicQuiz, hornyQuiz]
export const questions: Question[] = [basicQuestions, hornyQuestions].flat()
