import { Question, Quiz } from "./types";

export const charlesStreetQuiz: Quiz = {
    id: 1000004,
    name: "Charles Street Pack",
    subtitle: {
        secondPerson: "Are you a Charles Street lover or hater?",
        thirdPerson: "Is {name} a Charles Street lover or hater?",
    },
    src: require("../../assets/images/charlesStreet.jpeg"),
    leftLabel: "Charles Street Hater",
    rightLabel: "Charles Street 4 Life",
    resultLabels: [
        { label: "Charles Street Nemesis", emoji: "😠" },
        { label: "Charles Street Skeptic", emoji: "🤨" },
        { label: "Charles Street Neutral", emoji: "😐" },
        { label: "Charles Street Enthusiast", emoji: "😊" },
        { label: "Charles Street Superfan", emoji: "😍" },
    ],
};

export const charlesStreetQuestions: Question[] = [
    {
        id: 1000023,
        label: {
            secondPerson: "My favorite type of tree is:",
            thirdPerson: "{name}'s favorite type of tree is:",
        },
        options: [
            {
                label: { secondPerson: "Pine", thirdPerson: "Pine" },
                side: "right",
                emoji: "🌲",
            },
            {
                label: { secondPerson: "Oak", thirdPerson: "Oak" },
                side: "neither",
                emoji: "🌳",
            },
            {
                label: { secondPerson: "Maple", thirdPerson: "Maple" },
                side: "neither",
                emoji: "🍁",
            },
            {
                label: { secondPerson: "Apple", thirdPerson: "Apple" },
                side: "neither",
                emoji: "🍎",
            },
        ],
        quizId: 1000004,
    },
    {
        id: 1000024,
        label: {
            secondPerson: "I talk to other people on Charles Street:",
            thirdPerson: "{name} talks to other people on Charles Street:",
        },
        options: [
            {
                label: { secondPerson: "Rarely", thirdPerson: "Rarely" },
                side: "left",
                emoji: "🤐",
            },
            {
                label: { secondPerson: "Sometimes", thirdPerson: "Sometimes" },
                side: "neither",
                emoji: "🤔",
            },
            {
                label: { secondPerson: "Often", thirdPerson: "Often" },
                side: "right",
                emoji: "🗣️",
            },
        ],
        quizId: 1000004,
    },
    {
        id: 1000025,
        label: {
            secondPerson: "I believe Charles Street is:",
            thirdPerson: "{name} believes Charles Street is:",
        },
        options: [
            {
                label: {
                    secondPerson: "Ugly and sad",
                    thirdPerson: "Ugly and sad",
                },
                side: "left",
                emoji: "😢",
            },
            {
                label: {
                    secondPerson: "Just alright",
                    thirdPerson: "Just alright",
                },
                side: "neither",
                emoji: "😐",
            },
            {
                label: {
                    secondPerson: "A beautiful neighborhood",
                    thirdPerson: "A beautiful neighborhood",
                },
                side: "right",
                emoji: "😊",
            },
            {
                label: {
                    secondPerson: "The best place in the world!",
                    thirdPerson: "The best place in the world!",
                },
                side: "right",
                emoji: "🌟",
            },
        ],
        quizId: 1000004,
    },
    {
        id: 1000026,
        label: {
            secondPerson: "My relationship with Charles Street:",
            thirdPerson: "{name}'s relationship with Charles Street:",
        },
        options: [
            {
                label: {
                    secondPerson: "New to Charles Street",
                    thirdPerson: "New to Charles Street",
                },
                side: "neither",
                emoji: "🆕",
            },
            {
                label: {
                    secondPerson: "Been here a while",
                    thirdPerson: "Been here a while",
                },
                side: "right",
                emoji: "⏳",
            },
            {
                label: {
                    secondPerson: "Lived here FOREVER",
                    thirdPerson: "Lived here FOREVER",
                },
                side: "right",
                emoji: "🏠",
            },
        ],
        quizId: 1000004,
    },
    {
        id: 1000027,
        label: {
            secondPerson: "My favorite Charles Street landmark is:",
            thirdPerson: "{name}'s favorite Charles Street landmark is:",
        },
        options: [
            {
                label: {
                    secondPerson: "The Trolley Trail",
                    thirdPerson: "The Trolley Trail",
                },
                side: "right",
                emoji: "🚋",
            },
            {
                label: {
                    secondPerson: "The Pine Tree",
                    thirdPerson: "The Pine Tree",
                },
                side: "right",
                emoji: "🌲",
            },
            {
                label: {
                    secondPerson: "The Circle (Cul De Sac)",
                    thirdPerson: "The Circle (Cul De Sac)",
                },
                side: "right",
                emoji: "🔄",
            },
            {
                label: {
                    secondPerson: "The Secret Pathway",
                    thirdPerson: "The Secret Pathway",
                },
                side: "right",
                emoji: "🛤️",
            },
        ],
        quizId: 1000004,
    },
];
