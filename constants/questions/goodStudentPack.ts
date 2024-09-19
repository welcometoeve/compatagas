import { Question, Quiz } from "./types";

export const goodStudentQuiz: Quiz = {
    id: 7,
    name: "Good Student Pack",
    subtitle: {
        secondPerson: "Let's be honest",
        thirdPerson: "Let's be honest about {name}",
    },
    src: require("../../assets/images/goodStudentQuiz.jpg"),
    leftLabel: "Slacker",
    rightLabel: "Overachiever",
    resultLabels: [
        { label: "Professional Procrastinator", emoji: "😴" },
        { label: "Casual Learner", emoji: "🙂" },
        { label: "Balanced Student", emoji: "📚" },
        { label: "Dedicated Scholar", emoji: "🤓" },
        { label: "Academic Superstar", emoji: "🌟" },
    ],
};

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
                label: { secondPerson: "Art/Music", thirdPerson: "Art/Music" },
                side: "neither",
                emoji: "🎨",
            },
            {
                label: { secondPerson: "Lunch", thirdPerson: "Lunch" },
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
            thirdPerson:
                "When {name} doesn't understand something in class, they:",
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
];
