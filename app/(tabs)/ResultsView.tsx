import { Quiz, quizzes } from "@/components/questions"
import React, { useState } from "react"
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ChevronRight } from "lucide-react-native"
import { useSelfAnswers } from "@/contexts/SelfAnswerContext"
import { useFriendAnswers } from "@/contexts/FriendAnswerContext"
import { useUser } from "@/contexts/UserContext"

const ResultsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"your" | "their">("your")
  const { selfAnswers } = useSelfAnswers()
  const { friendAnswers } = useFriendAnswers()
  const { user } = useUser()
  const renderQuizItem = ({ item }: { item: Quiz }) => (
    <TouchableOpacity style={styles.quizItem}>
      <Image source={item.src} style={styles.quizImage} />
      <View style={styles.quizInfo}>
        <Text style={styles.quizTitle}>{item.name}</Text>
        <Text
          style={styles.quizSubtitle}
        >{`${item.leftLabel} vs ${item.rightLabel}`}</Text>
      </View>
      <ChevronRight color="#fff" size={24} />
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "your" && styles.activeTab]}
          onPress={() => setActiveTab("your")}
        >
          <Text style={styles.tabText}>Your Quizzes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "their" && styles.activeTab]}
          onPress={() => setActiveTab("their")}
        >
          <Text style={styles.tabText}>Their Quizzes</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={quizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>
          {activeTab === "your"
            ? "Quizzes will show up when someone else has taken them about you."
            : "Quizzes will show up when you have taken them about someone else."}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark mode background color
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Darker border color
    paddingTop: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff", // White border for active tab
  },
  tabText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // White text color
  },
  list: {
    flex: 1,
  },
  quizItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Darker border color
    height: 100, // Increased height
  },
  quizImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    borderRadius: 5, // Rounded corners
  },
  quizInfo: {
    flex: 1,
    justifyContent: "center",
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // White text color
    marginBottom: 5, // Added space between title and subtitle
  },
  quizSubtitle: {
    fontSize: 14,
    color: "#aaa", // Light gray text color
  },
  bottomTextContainer: {
    paddingHorizontal: 40,
    paddingBottom: 0,
  },
  bottomText: {
    color: "gray",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
})

export default ResultsView
