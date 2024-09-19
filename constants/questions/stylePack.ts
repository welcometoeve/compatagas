import { Question, Quiz } from "./types";

export const styleQuiz: Quiz = {
  id: 5,
  name: "Style Pack",
  subtitle: {
    secondPerson: "How stylish are you?",
    thirdPerson: "How stylish is {name}?",
  },
  src: require("../../assets/images/stylePack.jpg"),
  leftLabel: "Style Novice",
  rightLabel: "Fashion Forward",
  resultLabels: [
    { label: "Comfort Seeker", emoji: "🛋️" },
    { label: "Practical Dresser", emoji: "👕" },
    { label: "Casual Chic", emoji: "😎" },
    { label: "Style Enthusiast", emoji: "🎨" },
    { label: "Fashion Savvy", emoji: "✨" },
  ],
};

export const styleQuestions: Question[] = [
  {
    id: 30,
    label: {
      secondPerson: "I dress for:",
      thirdPerson: "{name} dresses for:",
    },
    options: [
      {
        label: {
          secondPerson: "Comfort",
          thirdPerson: "Comfort",
        },
        side: "left",
        emoji: "😌",
      },
      {
        label: {
          secondPerson: "Practicality",
          thirdPerson: "Practicality",
        },
        side: "left",
        emoji: "🛠️",
      },
      {
        label: {
          secondPerson: "Trendiness",
          thirdPerson: "Trendiness",
        },
        side: "right",
        emoji: "🌟",
      },
      {
        label: {
          secondPerson: "Attention",
          thirdPerson: "Attention",
        },
        side: "neither",
        emoji: "🎭",
      },
      {
        label: {
          secondPerson: "Self-expression",
          thirdPerson: "Self-expression",
        },
        side: "right",
        emoji: "🎨",
      },
    ],
    quizId: 5,
  },
  {
    id: 31,
    label: {
      secondPerson: "My ideal outfit is:",
      thirdPerson: "{name}'s ideal outfit is:",
    },
    options: [
      {
        label: {
          secondPerson: "Simple",
          thirdPerson: "Simple",
        },
        side: "left",
        emoji: "🧘",
      },
      {
        label: {
          secondPerson: "Cute",
          thirdPerson: "Cute",
        },
        side: "right",
        emoji: "🥰",
      },
      {
        label: {
          secondPerson: "Bold",
          thirdPerson: "Bold",
        },
        side: "right",
        emoji: "💥",
      },
      {
        label: {
          secondPerson: "Anything that covers my body",
          thirdPerson: "Anything that covers their body",
        },
        side: "left",
        emoji: "🙈",
      },
      {
        label: {
          secondPerson: "Unique and eclectic",
          thirdPerson: "Unique and eclectic",
        },
        side: "right",
        emoji: "🦄",
      },
    ],
    quizId: 5,
  },
  {
    id: 32,
    label: {
      secondPerson: "How often do I switch up my style:",
      thirdPerson: "How often does {name} switch up their style:",
    },
    options: [
      {
        label: {
          secondPerson: "Never",
          thirdPerson: "Never",
        },
        side: "left",
        emoji: "🗿",
      },
      {
        label: {
          secondPerson: "Rarely",
          thirdPerson: "Rarely",
        },
        side: "left",
        emoji: "🐢",
      },
      {
        label: {
          secondPerson: "Occasionally",
          thirdPerson: "Occasionally",
        },
        side: "neither",
        emoji: "🌗",
      },
      {
        label: {
          secondPerson: "Frequently",
          thirdPerson: "Frequently",
        },
        side: "right",
        emoji: "🌈",
      },
      {
        label: {
          secondPerson: "Daily",
          thirdPerson: "Daily",
        },
        side: "new",
        emoji: "🔄",
      },
    ],
    quizId: 5,
  },
  {
    id: 33,
    label: {
      secondPerson: "I accessorize with:",
      thirdPerson: "{name} accessorizes with:",
    },
    options: [
      {
        label: {
          secondPerson: "Minimal or no accessories",
          thirdPerson: "Minimal or no accessories",
        },
        side: "left",
        emoji: "🚫",
      },
      {
        label: {
          secondPerson: "One signature piece",
          thirdPerson: "One signature piece",
        },
        side: "neither",
        emoji: "💍",
      },
      {
        label: {
          secondPerson: "Multiple, coordinated accessories",
          thirdPerson: "Multiple, coordinated accessories",
        },
        side: "right",
        emoji: "👑",
      },
      {
        label: {
          secondPerson: "Bold, attention-grabbing pieces",
          thirdPerson: "Bold, attention-grabbing pieces",
        },
        side: "right",
        emoji: "🎭",
      },
      {
        label: {
          secondPerson: "Handmade or vintage pieces",
          thirdPerson: "Handmade or vintage pieces",
        },
        side: "right",
        emoji: "🧵",
      },
    ],
    quizId: 5,
  },
  {
    id: 34,
    label: {
      secondPerson: "My closet is filled mostly with:",
      thirdPerson: "{name}'s closet is filled mostly with:",
    },
    options: [
      {
        label: {
          secondPerson: "Random pieces",
          thirdPerson: "Random pieces",
        },
        side: "left",
        emoji: "🎲",
      },
      {
        label: {
          secondPerson: "Good basics in neutral colors",
          thirdPerson: "Good basics in neutral colors",
        },
        side: "left",
        emoji: "🧥",
      },
      {
        label: {
          secondPerson: "A rainbow of colors and patterns",
          thirdPerson: "A rainbow of colors and patterns",
        },
        side: "right",
        emoji: "🌈",
      },
      {
        label: {
          secondPerson: "A mix of basics and statement pieces",
          thirdPerson: "A mix of basics and statement pieces",
        },
        side: "right",
        emoji: "👚",
      },
      {
        label: {
          secondPerson: "Thrifted and upcycled items",
          thirdPerson: "Thrifted and upcycled items",
        },
        side: "right",
        emoji: "♻️",
      },
    ],
    quizId: 5,
  },
];
