import { Question, Quiz } from "./types";

export const NeighborQuiz: Quiz = {
    id: 20,
    name: "Neighbor Pack",
    subtitle: {
        secondPerson: "Are you a good neighbor?",
        thirdPerson: "Is {name} a good neighbor?",
    },
    src: require("../../assets/images/neighborQuiz.jpg"),
    leftLabel: "Demon Neighbor",
    rightLabel: "Dream Neighbor",
    resultLabels: [
        { label: "Kick Off The Street", emoji: "🔊" },
        { label: "Distant Dweller", emoji: "🏠" },
        { label: "Casual Acquaintance", emoji: "👋" },
        { label: "Friendly Face", emoji: "😊" },
        { label: "Basically Family", emoji: "🏆" },
    ],
};

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
                    secondPerson:
                        "Give it to them in exchange for cookies later on",
                    thirdPerson:
                        "Give it to them in exchange for cookies later on",
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
            thirdPerson:
                "{name} hears their favorite neighbor has the flu. They:",
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
                    secondPerson:
                        "Say yes and use the key to have sex in their bed",
                    thirdPerson:
                        "Say yes and use the key to have sex in their bed",
                },
                side: "left",
                emoji: "🛏️",
            },
        ],
        quizId: 20,
    },
];
