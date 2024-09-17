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

export const styleQuiz: Quiz = {
  id: 5,
  name: "Style Pack",
  src: require("../assets/images/stylePack.png"),
  leftLabel: "Casual",
  rightLabel: "Fashionista",
}

export const badPersonQuiz: Quiz = {
  id: 6,
  name: "Bad Person Pack",
  src: require("../assets/images/badPersonPack.webp"),
  leftLabel: "Saint",
  rightLabel: "Sinner",
}

export const goodStudentQuiz: Quiz = {
  id: 7,
  name: "Good Student Pack",
  src: require("../assets/images/goodStudentPack.png"),
  leftLabel: "Slacker",
  rightLabel: "Overachiever",
}

export const styleQuestions: Question[] = [
  {
    id: 30,
    secondPersonLabel: "I dress for:",
    thirdPersonLabel: "They dress for:",
    options: [
      { label: "Comfort", side: Side.LEFT },
      { label: "Practicality", side: Side.LEFT },
      { label: "Trendiness", side: Side.RIGHT },
      { label: "Attention", side: Side.RIGHT },
    ],
    quizId: 5,
  },
  {
    id: 31,
    secondPersonLabel: "My ideal outfit is:",
    thirdPersonLabel: "Their ideal outfit is:",
    options: [
      { label: "Simple", side: Side.NEITHER },
      { label: "Cute", side: Side.RIGHT },
      { label: "Bold", side: Side.RIGHT },
      { label: "Anything that covers my body", side: Side.LEFT },
    ],
    quizId: 5,
  },
  {
    id: 32,
    secondPersonLabel: "How often do I switch up my style:",
    thirdPersonLabel: "How often do they switch up their style:",
    options: [
      { label: "Never", side: Side.LEFT },
      { label: "Rarely", side: Side.LEFT },
      { label: "Occasionally", side: Side.NEITHER },
      { label: "Frequently", side: Side.RIGHT },
    ],
    quizId: 5,
  },
  {
    id: 33,
    secondPersonLabel: "I accessorize with:",
    thirdPersonLabel: "They accessorize with:",
    options: [
      { label: "Minimal or no accessories", side: Side.LEFT },
      { label: "One signature piece", side: Side.NEITHER },
      { label: "Multiple, coordinated accessories", side: Side.RIGHT },
      { label: "Bold, attention-grabbing pieces", side: Side.RIGHT },
    ],
    quizId: 5,
  },
  {
    id: 34,
    secondPersonLabel: "My closet is filled mostly with:",
    thirdPersonLabel: "Their closet is filled mostly with:",
    options: [
      { label: "Random pieces", side: Side.LEFT },
      { label: "Good basics in neutral colors", side: Side.LEFT },
      { label: "A rainbow of colors and patterns", side: Side.RIGHT },
      { label: "A mix of basics and statement pieces", side: Side.RIGHT },
    ],
    quizId: 5,
  },
]

export const badPersonQuestions: Question[] = [
  {
    id: 35,
    secondPersonLabel: "Your best friend asks to copy your homework. You:",
    thirdPersonLabel: "Their best friend asks to copy their homework. They:",
    options: [
      {
        label: "Refuse and offer to explain the material instead",
        side: Side.LEFT,
      },
      {
        label: "Let them copy but change a few answers so it's not obvious",
        side: Side.NEITHER,
      },
      {
        label: "Give them the homework without hesitation",
        side: Side.NEITHER,
      },
      { label: "Lie and say you haven't done it either", side: Side.RIGHT },
    ],
    quizId: 6,
  },
  {
    id: 36,
    secondPersonLabel:
      "You overhear someone spreading a rumor about a classmate. You:",
    thirdPersonLabel:
      "They overhear someone spreading a rumor about a classmate. They:",
    options: [
      { label: "Defend the classmate", side: Side.LEFT },
      { label: "Mind your own business", side: Side.NEITHER },
      { label: "Try to change the subject", side: Side.NEITHER },
      { label: "Join in and add some juicy details", side: Side.RIGHT },
    ],
    quizId: 6,
  },
  {
    id: 37,
    secondPersonLabel:
      "During a group project, one member isn't pulling their weight. You:",
    thirdPersonLabel:
      "During a group project, one member isn't pulling their weight. They:",
    options: [
      { label: "Talk to them about it privately", side: Side.LEFT },
      { label: "Do the work for them", side: Side.NEITHER },
      { label: "Talk to the teacher", side: Side.NEITHER },
      {
        label: "Turn the assignment in without their name on it",
        side: Side.RIGHT,
      },
    ],
    quizId: 6,
  },
  {
    id: 38,
    secondPersonLabel: "You notice a new student sitting alone at lunch. You:",
    thirdPersonLabel: "They notice a new student sitting alone at lunch. They:",
    options: [
      { label: "Invite them to sit with your group", side: Side.LEFT },
      { label: "Smile at them but don't say anything", side: Side.NEITHER },
      { label: "Do nothing", side: Side.NEITHER },
      { label: "Call them a loser and laugh", side: Side.RIGHT },
    ],
    quizId: 6,
  },
  {
    id: 39,
    secondPersonLabel:
      "Your crush asks you out, but you know your friend likes them too. You:",
    thirdPersonLabel:
      "Their crush asks them out, but they know their friend likes them too. They:",
    options: [
      { label: "Turn them down", side: Side.LEFT },
      { label: "Ask the friend before answering", side: Side.LEFT },
      { label: "Go out with them in secret", side: Side.RIGHT },
      {
        label: "Say yes and gloat to your friend (Finders keepers)",
        side: Side.RIGHT,
      },
    ],
    quizId: 6,
  },
]

export const goodStudentQuestions: Question[] = [
  {
    id: 40,
    secondPersonLabel: "Favorite subject:",
    thirdPersonLabel: "Favorite subject:",
    options: [
      { label: "Science/Math", side: Side.RIGHT },
      { label: "History/Gov", side: Side.RIGHT },
      { label: "English/Foreign Language", side: Side.NEITHER },
      { label: "Art/Music", side: Side.LEFT },
      { label: "Lunch", side: Side.LEFT },
    ],
    quizId: 7,
  },
  {
    id: 41,
    secondPersonLabel: "I do my homework:",
    thirdPersonLabel: "They do their homework:",
    options: [
      { label: "As soon as I get home from school", side: Side.RIGHT },
      { label: "After I am done relaxing", side: Side.NEITHER },
      { label: "As late at night as possible", side: Side.LEFT },
      { label: "The morning before class", side: Side.LEFT },
    ],
    quizId: 7,
  },
  {
    id: 42,
    secondPersonLabel: "When you don't understand something in class, you:",
    thirdPersonLabel: "When they don't understand something in class, they:",
    options: [
      { label: "Ask the teacher", side: Side.RIGHT },
      { label: "Google it later", side: Side.RIGHT },
      { label: "Ask a friend after class", side: Side.NEITHER },
      { label: "Hope it's not on the test", side: Side.LEFT },
    ],
    quizId: 7,
  },
  {
    id: 43,
    secondPersonLabel: "When assigned a book to read you:",
    thirdPersonLabel: "When assigned a book to read they:",
    options: [
      { label: "Read ahead", side: Side.RIGHT },
      { label: "Do only the assigned chapters", side: Side.NEITHER },
      { label: "Rely on SparkNotes", side: Side.LEFT },
      { label: "Show up to class with nothing but vibes", side: Side.LEFT },
    ],
    quizId: 7,
  },
  {
    id: 44,
    secondPersonLabel: "The night before a test you are usually:",
    thirdPersonLabel: "The night before a test they are usually:",
    options: [
      { label: "In bed early", side: Side.RIGHT },
      { label: "Up late cramming", side: Side.RIGHT },
      { label: "Scrolling through Instagram", side: Side.LEFT },
      { label: "Unaware there's a test tomorrow", side: Side.LEFT },
    ],
    quizId: 7,
  },
]

export const quizzes: Quiz[] = [styleQuiz, badPersonQuiz, goodStudentQuiz]
export const questions: Question[] = [
  ...styleQuestions,
  ...badPersonQuestions,
  ...goodStudentQuestions,
]
