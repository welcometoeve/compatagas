import { ImageSourcePropType } from "react-native"

export type ResultLabel = {
  label: string
  emoji: string
}

export type Quiz = {
  id: number
  name: string
  src: ImageSourcePropType
  leftLabel: string
  rightLabel: string
  subtitle: {
    secondPerson: string
    thirdPerson: string
  }
  resultLabels?: ResultLabel[]
}

export type Side = "left" | "right" | "neither" | "new"

export type Option = {
  label: {
    secondPerson: string
    thirdPerson: string
  }
  side: Side
  emoji: string
}

export type Question = {
  id: number
  label: {
    secondPerson: string
    thirdPerson: string
  }
  options: Option[]
  quizId: number
}

export const NeighborQuiz: Quiz = {
  id: 20,
  name: "Neighbor Pack",
  subtitle: {
    secondPerson: "Are you a good neighbor?",
    thirdPerson: "Is {name} a good neighbor?",
  },
  src: require("../assets/images/neighborQuiz.jpg"),
  leftLabel: "Demon Neighbor",
  rightLabel: "Dream Neighbor",
  resultLabels: [
    { label: "Kick Off The Street", emoji: "🔊" },
    { label: "Distant Dweller", emoji: "🏠" },
    { label: "Casual Acquaintance", emoji: "👋" },
    { label: "Friendly Face", emoji: "😊" },
    { label: "Basically Family", emoji: "🏆" },
  ],
}

export const styleQuiz: Quiz = {
  id: 5,
  name: "Style Pack",
  subtitle: {
    secondPerson: "How stylish are you?",
    thirdPerson: "How stylish is {name}?",
  },
  src: require("../assets/images/stylePack.jpg"),
  leftLabel: "Style Novice",
  rightLabel: "Fashion Forward",
  resultLabels: [
    { label: "Comfort Seeker", emoji: "🛋️" },
    { label: "Practical Dresser", emoji: "👕" },
    { label: "Casual Chic", emoji: "😎" },
    { label: "Style Enthusiast", emoji: "🎨" },
    { label: "Fashion Savvy", emoji: "✨" },
  ],
}

export const badPersonQuiz: Quiz = {
  id: 6,
  name: "Bad Person Pack",
  subtitle: {
    secondPerson: "Are you a bad person?",
    thirdPerson: "Is {name} a bad person?",
  },
  src: require("../assets/images/badPersonPack.png"),
  leftLabel: "Saint",
  rightLabel: "Sinner",
  resultLabels: [
    { label: "Angel in Disguise", emoji: "😇" },
    { label: "Mostly Good", emoji: "🤗" },
    { label: "Morally Gray", emoji: "🤔" },
    { label: "Troublemaker", emoji: "😈" },
    { label: "Certified Villain", emoji: "🦹" },
  ],
}

export const goodStudentQuiz: Quiz = {
  id: 7,
  name: "Good Student Pack",
  subtitle: {
    secondPerson: "Let's be honest",
    thirdPerson: "Let's be honest about {name}",
  },
  src: require("../assets/images/goodStudentQuiz.jpg"),
  leftLabel: "Slacker",
  rightLabel: "Overachiever",
  resultLabels: [
    { label: "Professional Procrastinator", emoji: "😴" },
    { label: "Casual Learner", emoji: "🙂" },
    { label: "Balanced Student", emoji: "📚" },
    { label: "Dedicated Scholar", emoji: "🤓" },
    { label: "Academic Superstar", emoji: "🌟" },
  ],
}

export const musicQuiz: Quiz = {
  id: 3,
  name: "Music Pack",
  subtitle: {
    secondPerson: "Are your music tastes basic?",
    thirdPerson: "Are {name}'s music tastes basic?",
  },
  src: require("../assets/images/musicQuiz.jpeg"),
  leftLabel: "Not Basic",
  rightLabel: "Basic",
  resultLabels: [
    { label: "Underground Music Aficionado", emoji: "🎧" },
    { label: "Eclectic Listener", emoji: "🎵" },
    { label: "Mainstream with a Twist", emoji: "🎶" },
    { label: "Top 40 Enthusiast", emoji: "📻" },
    { label: "Unapologetically Pop", emoji: "🎤" },
  ],
}

export const chadQuiz: Quiz = {
  id: 4,
  name: "Chad Pack",
  subtitle: {
    secondPerson: "Are you a chad?",
    thirdPerson: "Is {name} a chad?",
  },
  src: require("../assets/images/chadQuiz.webp"),
  leftLabel: "Not Chad",
  rightLabel: "Chad",
  resultLabels: [
    { label: "Definitely Not Chad", emoji: "🤓" },
    { label: "Chad-Curious", emoji: "🤔" },
    { label: "Chad in Training", emoji: "💪" },
    { label: "Almost Chad", emoji: "😎" },
    { label: "Ultimate Chad", emoji: "🏋️" },
  ],
}

export const musicQuestions: Question[] = [
  {
    id: 17,
    label: {
      secondPerson:
        "Walking Spotify algorithm or still figuring out who Chappell Roan is?",
      thirdPerson: "{name} is:",
    },
    options: [
      {
        label: {
          secondPerson: "Walking Spotify algorithm",
          thirdPerson: "A walking Spotify algorithm",
        },
        side: "left",
        emoji: "🎧",
      },
      {
        label: {
          secondPerson: "Still figuring out who Chappell Roan is",
          thirdPerson: "Still figuring out who Chappell Roan is",
        },
        side: "right",
        emoji: "🤔",
      },
    ],
    quizId: 3,
  },
  {
    id: 18,
    label: {
      secondPerson: "DJ of the friend group or banned from AUX?",
      thirdPerson: "{name} is:",
    },
    options: [
      {
        label: {
          secondPerson: "DJ of the friend group",
          thirdPerson: "DJ of the friend group",
        },
        side: "left",
        emoji: "🎉",
      },
      {
        label: {
          secondPerson: "Banned from AUX",
          thirdPerson: "Banned from AUX",
        },
        side: "right",
        emoji: "🚫",
      },
    ],
    quizId: 3,
  },
  {
    id: 19,
    label: {
      secondPerson:
        "Connoisseur of niche artists, top 1% of Taylor Swift listeners, or somewhere in between?",
      thirdPerson: "{name} is:",
    },
    options: [
      {
        label: {
          secondPerson: "Connoisseur of niche artists",
          thirdPerson: "A connoisseur of niche artists",
        },
        side: "left",
        emoji: "🎵",
      },
      {
        label: {
          secondPerson: "Top 1% of Taylor Swift listeners",
          thirdPerson: "Top 1% of Taylor Swift listeners",
        },
        side: "right",
        emoji: "🎤",
      },
      {
        label: {
          secondPerson: "Somewhere in between",
          thirdPerson: "Somewhere in between",
        },
        side: "neither",
        emoji: "🤷",
      },
    ],
    quizId: 3,
  },
  {
    id: 20,
    label: {
      secondPerson: "Spotify Surfer or Tiktok top 100 ONLY?",
      thirdPerson: "{name} is:",
    },
    options: [
      {
        label: {
          secondPerson: "Spotify Surfer",
          thirdPerson: "A spotify Surfer",
        },
        side: "left",
        emoji: "🏄",
      },
      {
        label: {
          secondPerson: "Tiktok top 100 ONLY",
          thirdPerson: "Tiktok top 100 ONLY",
        },
        side: "right",
        emoji: "📱",
      },
    ],
    quizId: 3,
  },
  {
    id: 21,
    label: {
      secondPerson: "Music experimentalist or sticks to what they know?",
      thirdPerson: "{name} is:",
    },
    options: [
      {
        label: {
          secondPerson: "Music experimentalist",
          thirdPerson: "A music experimentalist",
        },
        side: "left",
        emoji: "🧪",
      },
      {
        label: {
          secondPerson: "Sticks to what they know",
          thirdPerson: "Sticks to what they know",
        },
        side: "right",
        emoji: "🔁",
      },
    ],
    quizId: 3,
  },
  {
    id: 22,
    label: {
      secondPerson: "What's your favorite genre?",
      thirdPerson: "What's {name}'s favorite genre?",
    },
    options: [
      {
        label: {
          secondPerson: "Pop",
          thirdPerson: "Pop",
        },
        side: "right",
        emoji: "🎤",
      },
      {
        label: {
          secondPerson: "Rock",
          thirdPerson: "Rock",
        },
        side: "neither",
        emoji: "🎸",
      },
      {
        label: {
          secondPerson: "EDM",
          thirdPerson: "EDM",
        },
        side: "neither",
        emoji: "🎛️",
      },
      {
        label: {
          secondPerson: "R&B",
          thirdPerson: "R&B",
        },
        side: "neither",
        emoji: "🎶",
      },
      {
        label: {
          secondPerson: "Indie",
          thirdPerson: "Indie",
        },
        side: "neither",
        emoji: "🎹",
      },
    ],
    quizId: 3,
  },
]

export const chadQuestions: Question[] = [
  {
    id: 23,
    label: {
      secondPerson: "Casual mewer, pro mogger, or not a looksmaxxer?",
      thirdPerson:
        "Is {name} a casual mewer, pro mogger, or not a looksmaxxer?",
    },
    options: [
      {
        label: {
          secondPerson: "Casual mewer",
          thirdPerson: "Casual mewer",
        },
        side: "right",
        emoji: "😼",
      },
      {
        label: {
          secondPerson: "Pro mogger",
          thirdPerson: "Pro mogger",
        },
        side: "right",
        emoji: "💪",
      },
      {
        label: {
          secondPerson: "Not a looksmaxxer",
          thirdPerson: "Not a looksmaxxer",
        },
        side: "left",
        emoji: "🤷",
      },
    ],
    quizId: 4,
  },
  {
    id: 24,
    label: {
      secondPerson: "Gym rat or sofa sergeant?",
      thirdPerson: "{name} is a gym rat or sofa sergeant?",
    },
    options: [
      {
        label: {
          secondPerson: "Gym rat",
          thirdPerson: "Gym rat",
        },
        side: "right",
        emoji: "🏋️",
      },
      {
        label: {
          secondPerson: "Sofa sergeant",
          thirdPerson: "Sofa sergeant",
        },
        side: "left",
        emoji: "🛋️",
      },
    ],
    quizId: 4,
  },
  {
    id: 25,
    label: {
      secondPerson: "Beast mode or feast mode?",
      thirdPerson: "{name} is in beast mode or feast mode?",
    },
    options: [
      {
        label: {
          secondPerson: "Beast mode",
          thirdPerson: "Beast mode",
        },
        side: "right",
        emoji: "💪",
      },
      {
        label: {
          secondPerson: "Feast mode",
          thirdPerson: "Feast mode",
        },
        side: "left",
        emoji: "🍔",
      },
    ],
    quizId: 4,
  },
  {
    id: 26,
    label: {
      secondPerson: "Social butterfly or keyboard warrior?",
      thirdPerson: "Is {name} a social butterfly or keyboard warrior?",
    },
    options: [
      {
        label: {
          secondPerson: "Social butterfly",
          thirdPerson: "Social butterfly",
        },
        side: "right",
        emoji: "🦋",
      },
      {
        label: {
          secondPerson: "Keyboard warrior",
          thirdPerson: "Keyboard warrior",
        },
        side: "left",
        emoji: "⌨️",
      },
    ],
    quizId: 4,
  },
  {
    id: 27,
    label: {
      secondPerson: "Rizz master or shy guy?",
      thirdPerson: "Is {name} a rizz master or shy guy?",
    },
    options: [
      {
        label: {
          secondPerson: "Rizz master",
          thirdPerson: "Rizz master",
        },
        side: "right",
        emoji: "😎",
      },
      {
        label: {
          secondPerson: "Shy guy",
          thirdPerson: "Shy guy",
        },
        side: "left",
        emoji: "🙈",
      },
    ],
    quizId: 4,
  },
  {
    id: 28,
    label: {
      secondPerson: "Sigma or simp?",
      thirdPerson: "Is {name} a sigma or simp?",
    },
    options: [
      {
        label: {
          secondPerson: "Sigma",
          thirdPerson: "Sigma",
        },
        side: "right",
        emoji: "🐺",
      },
      {
        label: {
          secondPerson: "Simp",
          thirdPerson: "Simp",
        },
        side: "left",
        emoji: "🥺",
      },
    ],
    quizId: 4,
  },
  {
    id: 29,
    label: {
      secondPerson: "Which do you prefer on a Friday night?",
      thirdPerson: "Which does {name} prefer on a Friday night?",
    },
    options: [
      {
        label: {
          secondPerson: "Rager with da boyz",
          thirdPerson: "Rager with da boyz",
        },
        side: "right",
        emoji: "🎉",
      },
      {
        label: {
          secondPerson: "Quiet night in",
          thirdPerson: "Quiet night in",
        },
        side: "left",
        emoji: "🏠",
      },
    ],
    quizId: 4,
  },
]

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
]

export const badPersonQuestions: Question[] = [
  {
    id: 35,
    label: {
      secondPerson: "Your best friend asks to copy your homework. You:",
      thirdPerson: "{name}'s best friend asks to copy their homework. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Refuse and offer to explain the material instead",
          thirdPerson: "Refuses and offers to explain the material instead",
        },
        side: "left",
        emoji: "📚",
      },
      {
        label: {
          secondPerson:
            "Let them copy but change a few answers so it's not obvious",
          thirdPerson:
            "Lets them copy but changes a few answers so it's not obvious",
        },
        side: "neither",
        emoji: "🤫",
      },
      {
        label: {
          secondPerson: "Give them the homework without hesitation",
          thirdPerson: "Gives them the homework without hesitation",
        },
        side: "neither",
        emoji: "🤝",
      },
      {
        label: {
          secondPerson: "Lie and say you haven't done it either",
          thirdPerson: "Lies and says they haven't done it either",
        },
        side: "right",
        emoji: "🤥",
      },
    ],
    quizId: 6,
  },
  {
    id: 36,
    label: {
      secondPerson:
        "You overhear someone spreading a rumor about a classmate. You:",
      thirdPerson:
        "{name} overhears someone spreading a rumor about a classmate. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Defend the classmate",
          thirdPerson: "Defends the classmate",
        },
        side: "left",
        emoji: "🛡️",
      },
      {
        label: {
          secondPerson: "Mind your own business",
          thirdPerson: "Minds their own business",
        },
        side: "neither",
        emoji: "🙈",
      },
      {
        label: {
          secondPerson: "Try to change the subject",
          thirdPerson: "Tries to change the subject",
        },
        side: "neither",
        emoji: "🗣️",
      },
      {
        label: {
          secondPerson: "Join in and add some juicy details",
          thirdPerson: "Joins in and adds some juicy details",
        },
        side: "right",
        emoji: "🍵",
      },
    ],
    quizId: 6,
  },
  {
    id: 37,
    label: {
      secondPerson:
        "During a group project, one member isn't pulling their weight. You:",
      thirdPerson:
        "During a group project, one member isn't pulling their weight. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Talk to them about it privately",
          thirdPerson: "Talks to them about it privately",
        },
        side: "left",
        emoji: "🤫",
      },
      {
        label: {
          secondPerson: "Do the work for them",
          thirdPerson: "Do the work for them",
        },
        side: "neither",
        emoji: "😮‍💨",
      },
      {
        label: {
          secondPerson: "Talk to the teacher",
          thirdPerson: "Talks to the teacher",
        },
        side: "neither",
        emoji: "👨‍🏫",
      },
      {
        label: {
          secondPerson: "Turn the assignment in without their name on it",
          thirdPerson: "Turns the assignment in without their name on it",
        },
        side: "right",
        emoji: "😈",
      },
    ],
    quizId: 6,
  },
  {
    id: 38,
    label: {
      secondPerson: "You notice a new student sitting alone at lunch. You:",
      thirdPerson: "{name} notices a new student sitting alone at lunch. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Invite them to sit with your group",
          thirdPerson: "Invite them to sit with their group",
        },
        side: "left",
        emoji: "🤗",
      },
      {
        label: {
          secondPerson: "Smile at them but don't say anything",
          thirdPerson: "Smile at them but doesn't say anything",
        },
        side: "neither",
        emoji: "😊",
      },
      {
        label: {
          secondPerson: "Do nothing",
          thirdPerson: "Do nothing",
        },
        side: "neither",
        emoji: "🙅",
      },
      {
        label: {
          secondPerson: "Call them a loser and laugh",
          thirdPerson: "Call them a loser and laughs",
        },
        side: "right",
        emoji: "😂",
      },
    ],
    quizId: 6,
  },
  {
    id: 39,
    label: {
      secondPerson:
        "Your crush asks you out, but you know your friend likes them too. You:",
      thirdPerson:
        "{name}'s crush asks them out, but they know their friend likes them too. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Turn them down",
          thirdPerson: "Turns them down",
        },
        side: "left",
        emoji: "💔",
      },
      {
        label: {
          secondPerson: "Ask the friend before answering",
          thirdPerson: "Asks the friend before answering",
        },
        side: "left",
        emoji: "🤔",
      },
      {
        label: {
          secondPerson: "Go out with them in secret",
          thirdPerson: "Goes out with them in secret",
        },
        side: "right",
        emoji: "🕵️",
      },
      {
        label: {
          secondPerson: "Say yes and gloat to your friend (Finders keepers)",
          thirdPerson: "Says yes and gloats to their friend (Finders keepers)",
        },
        side: "right",
        emoji: "😎",
      },
    ],
    quizId: 6,
  },
]

export const goodStudentQuestions: Question[] = [
  {
    id: 40,
    label: {
      secondPerson: "Favorite subject:",
      thirdPerson: "{name}'s favorite subject:",
    },
    options: [
      {
        label: {
          secondPerson: "Science/Math",
          thirdPerson: "Science/Math",
        },
        side: "neither",
        emoji: "🧪",
      },
      {
        label: {
          secondPerson: "History/Gov",
          thirdPerson: "History/Gov",
        },
        side: "neither",
        emoji: "📜",
      },
      {
        label: {
          secondPerson: "English/Foreign Language",
          thirdPerson: "English/Foreign Language",
        },
        side: "neither",
        emoji: "📚",
      },
      {
        label: {
          secondPerson: "Art/Music",
          thirdPerson: "Art/Music",
        },
        side: "neither",
        emoji: "🎨",
      },
      {
        label: {
          secondPerson: "Lunch",
          thirdPerson: "Lunch",
        },
        side: "neither",
        emoji: "🍱",
      },
    ],
    quizId: 7,
  },
  {
    id: 41,
    label: {
      secondPerson: "I do my homework:",
      thirdPerson: "{name} does their homework:",
    },
    options: [
      {
        label: {
          secondPerson: "As soon as I get home from school",
          thirdPerson: "As soon as they get home from school",
        },
        side: "right",
        emoji: "🏃‍♂️",
      },
      {
        label: {
          secondPerson: "After I am done relaxing",
          thirdPerson: "After they are done relaxing",
        },
        side: "neither",
        emoji: "😌",
      },
      {
        label: {
          secondPerson: "As late at night as possible",
          thirdPerson: "As late at night as possible",
        },
        side: "left",
        emoji: "🌙",
      },
      {
        label: {
          secondPerson: "The morning before class",
          thirdPerson: "The morning before class",
        },
        side: "left",
        emoji: "☀️",
      },
    ],
    quizId: 7,
  },
  {
    id: 42,
    label: {
      secondPerson: "When you don't understand something in class, you:",
      thirdPerson: "When {name} doesn't understand something in class, they:",
    },
    options: [
      {
        label: {
          secondPerson: "Ask the teacher",
          thirdPerson: "Ask the teacher",
        },
        side: "right",
        emoji: "🙋‍♂️",
      },
      {
        label: {
          secondPerson: "Google it later",
          thirdPerson: "Google it later",
        },
        side: "right",
        emoji: "🔍",
      },
      {
        label: {
          secondPerson: "Ask a friend after class",
          thirdPerson: "Ask a friend after class",
        },
        side: "neither",
        emoji: "👥",
      },
      {
        label: {
          secondPerson: "Hope it's not on the test",
          thirdPerson: "Hope it's not on the test",
        },
        side: "left",
        emoji: "🙏",
      },
    ],
    quizId: 7,
  },
  {
    id: 43,
    label: {
      secondPerson: "When assigned a book to read you:",
      thirdPerson: "When assigned a book to read {name}:",
    },
    options: [
      {
        label: {
          secondPerson: "Read ahead",
          thirdPerson: "Reads ahead",
        },
        side: "right",
        emoji: "📖",
      },
      {
        label: {
          secondPerson: "Do only the assigned chapters",
          thirdPerson: "Do only the assigned chapters",
        },
        side: "neither",
        emoji: "📚",
      },
      {
        label: {
          secondPerson: "Rely on SparkNotes",
          thirdPerson: "Relies on SparkNotes",
        },
        side: "left",
        emoji: "💡",
      },
      {
        label: {
          secondPerson: "Show up to class with nothing but vibes",
          thirdPerson: "Shows up to class with nothing but vibes",
        },
        side: "left",
        emoji: "😎",
      },
    ],
    quizId: 7,
  },
  {
    id: 44,
    label: {
      secondPerson: "The night before a test you are usually:",
      thirdPerson: "The night before a test {name} is usually:",
    },
    options: [
      {
        label: {
          secondPerson: "In bed early",
          thirdPerson: "In bed early",
        },
        side: "right",
        emoji: "😴",
      },
      {
        label: {
          secondPerson: "Up late cramming",
          thirdPerson: "Up late cramming",
        },
        side: "right",
        emoji: "📚",
      },
      {
        label: {
          secondPerson: "Scrolling through Instagram",
          thirdPerson: "Scrolling through Instagram",
        },
        side: "left",
        emoji: "📱",
      },
      {
        label: {
          secondPerson: "Unaware there's a test tomorrow",
          thirdPerson: "Unaware there's a test tomorrow",
        },
        side: "left",
        emoji: "😨",
      },
    ],
    quizId: 7,
  },
]

export const neighborQuestions: Question[] = [
  {
    id: 1,
    label: {
      secondPerson:
        "Your neighbor asks to borrow a cup of sugar to make cookies. You:",
      thirdPerson:
        "{name}'s neighbor asks to borrow a cup of sugar to make cookies. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Hand it over, no questions",
          thirdPerson: "Hand it over, no questions",
        },
        side: "right",
        emoji: "🤝",
      },
      {
        label: {
          secondPerson: "Give it to them in exchange for cookies later on",
          thirdPerson: "Give it to them in exchange for cookies later on",
        },
        side: "neither",
        emoji: "🍪",
      },
      {
        label: {
          secondPerson: "Call them a big-back and slam the door",
          thirdPerson: "Call them a big-back and slam the door",
        },
        side: "left",
        emoji: "🚪",
      },
    ],
    quizId: 20,
  },
  {
    id: 2,
    label: {
      secondPerson: "I talk to my neighbors:",
      thirdPerson: "{name} talks to their neighbors:",
    },
    options: [
      {
        label: {
          secondPerson: "Never",
          thirdPerson: "Never",
        },
        side: "left",
        emoji: "🙅",
      },
      {
        label: {
          secondPerson: "Rarely",
          thirdPerson: "Rarely",
        },
        side: "neither",
        emoji: "🕰️",
      },
      {
        label: {
          secondPerson: "Occasionally",
          thirdPerson: "Occasionally",
        },
        side: "right",
        emoji: "🗓️",
      },
      {
        label: {
          secondPerson: "Often",
          thirdPerson: "Often",
        },
        side: "right",
        emoji: "🗣️",
      },
    ],
    quizId: 20,
  },
  {
    id: 3,
    label: {
      secondPerson:
        "Your neighbor is having a loud party late at night. You first:",
      thirdPerson:
        "{name}'s neighbor is having a loud party late at night. They first:",
    },
    options: [
      {
        label: {
          secondPerson:
            "Ignore it and say something passive aggressive next time you see them",
          thirdPerson:
            "Ignore it and say something passive aggressive next time they see them",
        },
        side: "neither",
        emoji: "😒",
      },
      {
        label: {
          secondPerson: "Go over and ask them to quiet down",
          thirdPerson: "Go over and ask them to quiet down",
        },
        side: "right",
        emoji: "🤫",
      },
      {
        label: {
          secondPerson: "Go over and ask them if you can join",
          thirdPerson: "Go over and ask them if they can join",
        },
        side: "right",
        emoji: "🎉",
      },
      {
        label: {
          secondPerson: "Call the cops",
          thirdPerson: "Call the cops",
        },
        side: "left",
        emoji: "👮",
      },
    ],
    quizId: 20,
  },
  {
    id: 4,
    label: {
      secondPerson: "You hear your favorite neighbor has the flu. You:",
      thirdPerson: "{name} hears their favorite neighbor has the flu. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Bring them some cooked food",
          thirdPerson: "Bring them some cooked food",
        },
        side: "right",
        emoji: "🍲",
      },
      {
        label: {
          secondPerson: "Call them to check in",
          thirdPerson: "Call them to check in",
        },
        side: "right",
        emoji: "📞",
      },
      {
        label: {
          secondPerson: "Ignore the situation",
          thirdPerson: "Ignore the situation",
        },
        side: "neither",
        emoji: "🙈",
      },
      {
        label: {
          secondPerson:
            "Take photos of their sickly form through the window to laugh at later",
          thirdPerson:
            "Take photos of their sickly form through the window to laugh at later",
        },
        side: "left",
        emoji: "📸",
      },
    ],
    quizId: 20,
  },
  {
    id: 5,
    label: {
      secondPerson:
        "Your neighbor gives you their key and asks you to water their plants while they're away. You:",
      thirdPerson:
        "{name}'s neighbor gives them their key and asks them to water their plants while they're away. They:",
    },
    options: [
      {
        label: {
          secondPerson: "Agree to do it",
          thirdPerson: "Agree to do it",
        },
        side: "right",
        emoji: "🌱",
      },
      {
        label: {
          secondPerson: "Ask them how much they're going to pay",
          thirdPerson: "Ask them how much they're going to pay",
        },
        side: "neither",
        emoji: "💰",
      },
      {
        label: {
          secondPerson: "Say yes and use the key to have sex in their bed",
          thirdPerson: "Say yes and use the key to have sex in their bed",
        },
        side: "left",
        emoji: "🛏️",
      },
    ],
    quizId: 20,
  },
]
export const questions: Question[] = [
  ...styleQuestions,
  ...badPersonQuestions,
  ...goodStudentQuestions,
  ...musicQuestions,
  ...chadQuestions,
  ...neighborQuestions,
]

export const quizzes: Quiz[] = [
  NeighborQuiz,
  styleQuiz,
  goodStudentQuiz,
  musicQuiz,
  chadQuiz,
  badPersonQuiz,
]

export function insertName(text: string, name: string): string {
  return text.replace(/\{name\}/g, name)
}
