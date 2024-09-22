import { Question, Quiz } from "./types";

export const harryPotterQuiz: Quiz = {
    id: 98765432,
    name: "The Potter Pack",
    subtitle: {
        secondPerson: "What kind of wizard are you?",
        thirdPerson: "What kind of wizard is {name}?",
    },
    src: require("../../assets/images/potterPack.jpg"),
    leftLabel: "Muggle",
    rightLabel: "Magical Prodigy",
    resultLabels: [
        { label: "Squib", emoji: "😕" },
        { label: "First-Year Novice", emoji: "🧙‍♂️" },
        { label: "Competent Wizard", emoji: "✨" },
        { label: "Outstanding O.W.L. Student", emoji: "🦉" },
        { label: "Next Dumbledore", emoji: "🧙‍♂️" },
    ],
};

export const harryPotterQuestions: Question[] = [
    {
        id: 11111111,
        label: {
            secondPerson: "What house would you be in?",
            thirdPerson: "What house would {name} be in?",
        },
        options: [
            {
                label: {
                    secondPerson: "Gryffindor",
                    thirdPerson: "Gryffindor",
                },
                side: "right",
                emoji: "🦁",
            },
            {
                label: {
                    secondPerson: "Hufflepuff",
                    thirdPerson: "Hufflepuff",
                },
                side: "left",
                emoji: "🦡",
            },
            {
                label: {
                    secondPerson: "Ravenclaw",
                    thirdPerson: "Ravenclaw",
                },
                side: "right",
                emoji: "🦅",
            },
            {
                label: {
                    secondPerson: "Slytherin",
                    thirdPerson: "Slytherin",
                },
                side: "right",
                emoji: "🐍",
            },
        ],
        quizId: 98765432,
    },
    {
        id: 22222222,
        label: {
            secondPerson: "What would your wand core be made of?",
            thirdPerson: "What would {name}'s wand core be made of?",
        },
        options: [
            {
                label: {
                    secondPerson: "Dragon Heartstring",
                    thirdPerson: "Dragon Heartstring",
                },
                side: "right",
                emoji: "🐉",
            },
            {
                label: {
                    secondPerson: "Phoenix Tail Feather",
                    thirdPerson: "Phoenix Tail Feather",
                },
                side: "right",
                emoji: "🔥",
            },
            {
                label: {
                    secondPerson: "Unicorn Hair",
                    thirdPerson: "Unicorn Hair",
                },
                side: "left",
                emoji: "🦄",
            },
        ],
        quizId: 98765432,
    },
    {
        id: 33333333,
        label: {
            secondPerson: "What position would you play in Quidditch?",
            thirdPerson: "What position would {name} play in Quidditch?",
        },
        options: [
            {
                label: {
                    secondPerson: "Beater (Holds the bat)",
                    thirdPerson: "Beater (Holds the bat)",
                },
                side: "left",
                emoji: "🏏",
            },
            {
                label: {
                    secondPerson: "Chaser (Scores the goal)",
                    thirdPerson: "Chaser (Scores the goal)",
                },
                side: "right",
                emoji: "🏀",
            },
            {
                label: {
                    secondPerson: "Keeper (Defends the rings)",
                    thirdPerson: "Keeper (Defends the rings)",
                },
                side: "left",
                emoji: "🥅",
            },
            {
                label: {
                    secondPerson: "Seeker (Chases the Snitch)",
                    thirdPerson: "Seeker (Chases the Snitch)",
                },
                side: "right",
                emoji: "🔍",
            },
        ],
        quizId: 98765432,
    },
    {
        id: 44444444,
        label: {
            secondPerson: "What is your favorite magical subject?",
            thirdPerson: "What is {name}'s favorite magical subject?",
        },
        options: [
            {
                label: {
                    secondPerson: "Potions",
                    thirdPerson: "Potions",
                },
                side: "left",
                emoji: "🧪",
            },
            {
                label: {
                    secondPerson: "Charms",
                    thirdPerson: "Charms",
                },
                side: "right",
                emoji: "✨",
            },
            {
                label: {
                    secondPerson: "Divination",
                    thirdPerson: "Divination",
                },
                side: "left",
                emoji: "🔮",
            },
            {
                label: {
                    secondPerson: "Defence Against the Dark Arts",
                    thirdPerson: "Defence Against the Dark Arts",
                },
                side: "right",
                emoji: "🛡️",
            },
        ],
        quizId: 98765432,
    },
    {
        id: 55555555,
        label: {
            secondPerson: "What would your patronus charm be?",
            thirdPerson: "What would {name}'s patronus charm be?",
        },
        options: [
            {
                label: {
                    secondPerson: "A Hare",
                    thirdPerson: "A Hare",
                },
                side: "left",
                emoji: "🐰",
            },
            {
                label: {
                    secondPerson: "A Stag",
                    thirdPerson: "A Stag",
                },
                side: "right",
                emoji: "🦌",
            },
            {
                label: {
                    secondPerson: "A Fox",
                    thirdPerson: "A Fox",
                },
                side: "right",
                emoji: "🦊",
            },
            {
                label: {
                    secondPerson: "A Dolphin",
                    thirdPerson: "A Dolphin",
                },
                side: "left",
                emoji: "🐬",
            },
        ],
        quizId: 98765432,
    },
];
