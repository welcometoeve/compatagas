import { Question, Quiz } from "./types";

export const pettyQuiz: Quiz = {
    id: 73849201,
    name: "The Petty Pack",
    subtitle: {
        secondPerson: "How petty are you?",
        thirdPerson: "How petty is {name}?",
    },
    src: require("../../assets/images/pettyPack.webp"),
    leftLabel: "Reasonable Human Being",
    rightLabel: "Petty Nightmare",
    resultLabels: [
        { label: "Saint-like Patience", emoji: "😇" },
        { label: "Mostly Reasonable", emoji: "🙂" },
        { label: "Occasional Pettiness", emoji: "😏" },
        { label: "Petty Professional", emoji: "😤" },
        { label: "Ultimate Petty Nightmare", emoji: "😈" },
    ],
};

export const pettyQuestions: Question[] = [
    {
        id: 12345678,
        label: {
            secondPerson:
                "They get a text from their crush after an hour of waiting. They:",
            thirdPerson:
                "{name} gets a text from their crush after an hour of waiting. They:",
        },
        options: [
            {
                label: {
                    secondPerson: "Text back when convenient",
                    thirdPerson: "Texts back when convenient",
                },
                side: "left",
                emoji: "📱",
            },
            {
                label: {
                    secondPerson: "Wait 61 mins",
                    thirdPerson: "Waits 61 mins",
                },
                side: "right",
                emoji: "⏳",
            },
        ],
        quizId: 73849201,
    },
    {
        id: 23456789,
        label: {
            secondPerson:
                "Their sibling eats the last cookie in the pack. They:",
            thirdPerson:
                "{name}'s sibling eats the last cookie in the pack. They:",
        },
        options: [
            {
                label: {
                    secondPerson: "Forgive and forget",
                    thirdPerson: "Forgives and forgets",
                },
                side: "left",
                emoji: "🤗",
            },
            {
                label: {
                    secondPerson: "Complain and move on",
                    thirdPerson: "Complains and moves on",
                },
                side: "left",
                emoji: "😒",
            },
            {
                label: {
                    secondPerson: "Complain to a parent",
                    thirdPerson: "Complains to a parent",
                },
                side: "right",
                emoji: "👨‍👩‍👧‍👦",
            },
            {
                label: {
                    secondPerson: "Fill their pillowcase with glitter",
                    thirdPerson: "Fills their pillowcase with glitter",
                },
                side: "right",
                emoji: "✨",
            },
        ],
        quizId: 73849201,
    },
    {
        id: 34567890,
        label: {
            secondPerson:
                "Their bestie turns down a hangout so they can go on a date instead. They:",
            thirdPerson:
                "{name}'s bestie turns down a hangout so they can go on a date instead. They:",
        },
        options: [
            {
                label: {
                    secondPerson:
                        "Accept the outcome and have fun without bestie",
                    thirdPerson:
                        "Accepts the outcome and has fun without bestie",
                },
                side: "left",
                emoji: "👍",
            },
            {
                label: {
                    secondPerson:
                        "Post about the hangout passive aggressively to trigger bestie's FOMO",
                    thirdPerson:
                        "Posts about the hangout passive aggressively to trigger bestie's FOMO",
                },
                side: "right",
                emoji: "📸",
            },
            {
                label: {
                    secondPerson:
                        "Show up to the date pretending to be bestie's significant other",
                    thirdPerson:
                        "Shows up to the date pretending to be bestie's significant other",
                },
                side: "right",
                emoji: "🕵️",
            },
        ],
        quizId: 73849201,
    },
    {
        id: 45678901,
        label: {
            secondPerson:
                "Someone cuts in front of you in the lunch line. You:",
            thirdPerson:
                "Someone cuts in front of {name} in the lunch line. They:",
        },
        options: [
            {
                label: {
                    secondPerson:
                        "Politely ask them to go to the back of the line",
                    thirdPerson:
                        "Politely asks them to go to the back of the line",
                },
                side: "left",
                emoji: "🗣️",
            },
            {
                label: {
                    secondPerson: "Loudly announce to everyone that they cut",
                    thirdPerson: "Loudly announces to everyone that they cut",
                },
                side: "neither",
                emoji: "📢",
            },
            {
                label: {
                    secondPerson: "Trip them as they walk away with their tray",
                    thirdPerson: "Trips them as they walk away with their tray",
                },
                side: "right",
                emoji: "🦶",
            },
            {
                label: {
                    secondPerson:
                        "Secretly put their backpack in the lost and found",
                    thirdPerson:
                        "Secretly puts their backpack in the lost and found",
                },
                side: "right",
                emoji: "🎒",
            },
        ],
        quizId: 73849201,
    },
    {
        id: 56789012,
        label: {
            secondPerson:
                "Your classmate borrows your notes and gets a better grade than you on the test. You:",
            thirdPerson:
                "{name}'s classmate borrows their notes and gets a better grade than them on the test. They:",
        },
        options: [
            {
                label: {
                    secondPerson: "Congratulate them on their good grade",
                    thirdPerson: "Congratulates them on their good grade",
                },
                side: "left",
                emoji: "🎉",
            },
            {
                label: {
                    secondPerson: "Ask them to study together next time",
                    thirdPerson: "Asks them to study together next time",
                },
                side: "left",
                emoji: "📚",
            },
            {
                label: {
                    secondPerson:
                        "Refuse to share notes with anyone ever again",
                    thirdPerson:
                        "Refuses to share notes with anyone ever again",
                },
                side: "right",
                emoji: "🚫",
            },
            {
                label: {
                    secondPerson: "Give them fake notes before the next test",
                    thirdPerson: "Gives them fake notes before the next test",
                },
                side: "right",
                emoji: "😈",
            },
        ],
        quizId: 73849201,
    },
];
