import { Question, Quiz } from "./types";

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
};

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
                label: { secondPerson: "Gym rat", thirdPerson: "Gym rat" },
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
                label: { secondPerson: "Shy guy", thirdPerson: "Shy guy" },
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
                label: { secondPerson: "Sigma", thirdPerson: "Sigma" },
                side: "right",
                emoji: "🐺",
            },
            {
                label: { secondPerson: "Simp", thirdPerson: "Simp" },
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
];
