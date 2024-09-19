import { Question, Quiz } from "./types";

export const badPersonQuiz: Quiz = {
    id: 6,
    name: "Bad Person Pack",
    subtitle: {
        secondPerson: "Are you a bad person?",
        thirdPerson: "Is {name} a bad person?",
    },
    src: require("../../assets/images/badPersonPack.png"),
    leftLabel: "Saint",
    rightLabel: "Sinner",
    resultLabels: [
        { label: "Angel in Disguise", emoji: "😇" },
        { label: "Mostly Good", emoji: "🤗" },
        { label: "Morally Gray", emoji: "🤔" },
        { label: "Troublemaker", emoji: "😈" },
        { label: "Certified Villain", emoji: "🦹" },
    ],
};

export const badPersonQuestions: Question[] = [
    {
        id: 35,
        label: {
            secondPerson: "Your best friend asks to copy your homework. You:",
            thirdPerson:
                "{name}'s best friend asks to copy their homework. They:",
        },
        options: [
            {
                label: {
                    secondPerson:
                        "Refuse and offer to explain the material instead",
                    thirdPerson:
                        "Refuses and offers to explain the material instead",
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
                    secondPerson:
                        "Turn the assignment in without their name on it",
                    thirdPerson:
                        "Turns the assignment in without their name on it",
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
            secondPerson:
                "You notice a new student sitting alone at lunch. You:",
            thirdPerson:
                "{name} notices a new student sitting alone at lunch. They:",
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
                    secondPerson:
                        "Say yes and gloat to your friend (Finders keepers)",
                    thirdPerson:
                        "Says yes and gloats to their friend (Finders keepers)",
                },
                side: "right",
                emoji: "😎",
            },
        ],
        quizId: 6,
    },
];
