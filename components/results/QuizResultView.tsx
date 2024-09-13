import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { ChevronLeft } from "lucide-react-native"
import { Question, Quiz, Side } from "@/components/questions"
import { useUser } from "@/contexts/UserContext"
import { SelfAnswer, useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { FriendAnswer, useFriendAnswers } from "@/contexts/FriendAnswerContext"
import ResultSlider from "./ResultResultSlider"
import QuestionResultView from "./QuestionResultView"

type QuizResultsViewProps = {
  quiz: Quiz
  questions: Question[]
  goBack: () => void
  theirIds: number[]
  resultType: string
}

type Result = {
  id: number
  name: string
  value: number
  isSelf: boolean
}

const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  quiz,
  questions,
  goBack,
  theirIds,
}) => {
  const [results, setResults] = useState<Result[]>([])

  const { user, allUsers } = useUser()
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()

  useEffect(() => {
    if (user && selfAnswers && friendAnswers) {
      const allResults: Result[] = []

      // Calculate user's result
      const userAnswers = selfAnswers.filter(
        (sa) => sa.userId === user.id && sa.quizId === quiz.id
      )
      const userResult = calculateQuizResult(userAnswers)

      allResults.push({
        id: user.id,
        name: "You",
        value: userResult,
        isSelf: true,
      })

      // Calculate friends' results
      theirIds.forEach((friendId) => {
        const friendAnswers1 = friendAnswers.filter(
          (fa) => fa.friendId === friendId && fa.quizId === quiz.id
        )
        const friendResult = calculateQuizResult(friendAnswers1)
        const friendName =
          allUsers.find((u) => u.id === friendId)?.name || "Friend"
        allResults.push({
          id: friendId,
          name: friendName,
          value: friendResult,
          isSelf: false,
        })
      })

      setResults(allResults)
    }
  }, [user, selfAnswers, friendAnswers, questions, quiz.id, theirIds, allUsers])

  const calculateQuizResult = (answers: (SelfAnswer | FriendAnswer)[]) => {
    let totalScore = 0
    questions.forEach((question) => {
      const answer = answers.find((a) => a.questionId === question.id)
      if (answer) {
        const optionIndex = answer.optionIndex
        const side = question.options[optionIndex].side
        const score = side === Side.LEFT ? -1 : 1
        totalScore += score
      }
    })
    const averageScore = totalScore / questions.length
    return averageScore
  }

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    // This function is now a no-op since answers are locked in the results view
    console.log("Option selected:", questionId, optionIndex)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ChevronLeft size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.quizHeader}>
          <Image
            source={quiz.src}
            style={styles.quizImage}
            resizeMode="cover"
          />
          <Text style={styles.quizTitle}>{`Your ${quiz.name} Results`}</Text>
        </View>

        <ResultSlider quiz={quiz} results={results} />

        <View style={styles.spacer}></View>

        {questions.map((question) =>
          selfAnswers.find(
            (sa) => sa.userId === user?.id && sa.questionId === question.id
          ) ? (
            <QuestionResultView
              key={question.id}
              question={question}
              selfAnswer={
                selfAnswers.find(
                  (sa) =>
                    sa.userId === user?.id && sa.questionId === question.id
                )!
              }
              friendAnswers={friendAnswers.filter(
                (fa) =>
                  fa.questionId === question.id &&
                  theirIds.includes(fa.friendId)
              )}
              lockedAnswers={new Set(questions.map((q) => q.id))}
              handleOptionSelect={handleOptionSelect}
              index={question.id}
            />
          ) : null
        )}

        <TouchableOpacity onPress={goBack} style={styles.backToQuizzesButton}>
          <ChevronLeft size={20} color="white" style={styles.backButtonIcon} />
          <Text style={styles.backButtonText}>Back to Quizzes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 0,
  },
  backButton: {
    position: "absolute",
    top: 24,
    left: 24,
    zIndex: 1,
  },
  quizHeader: {
    marginBottom: 24,
    alignItems: "center",
  },
  quizImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  spacer: {
    height: 50,
  },
  backToQuizzesButton: {
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: "rgb(40, 40, 40)",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default QuizResultsView
