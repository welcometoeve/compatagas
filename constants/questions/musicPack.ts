import { Question, Quiz } from "./types";

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
};

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
                label: { secondPerson: "Pop", thirdPerson: "Pop" },
                side: "right",
                emoji: "🎤",
            },
            {
                label: { secondPerson: "Rock", thirdPerson: "Rock" },
                side: "neither",
                emoji: "🎸",
            },
            {
                label: { secondPerson: "EDM", thirdPerson: "EDM" },
                side: "neither",
                emoji: "🎛️",
            },
            {
                label: { secondPerson: "R&B", thirdPerson: "R&B" },
                side: "neither",
                emoji: "🎶",
            },
            {
                label: { secondPerson: "Indie", thirdPerson: "Indie" },
                side: "neither",
                emoji: "🎹",
            },
        ],
        quizId: 3,
    },
];
