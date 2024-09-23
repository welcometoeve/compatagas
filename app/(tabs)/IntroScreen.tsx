import { CustomCheckbox } from "@/components/profile/FriendListItem"
import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface IntroScreenProps {
  onAccessGranted: () => void
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onAccessGranted }) => {
  const [code, setCode] = useState<string>("")
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const { accessGranted, setAccessGranted } = useAccessGranted()

  useEffect(() => {
    if (accessGranted) {
      onAccessGranted()
    }
  }, [accessGranted, onAccessGranted])

  const handleSubmit = () => {
    if (
      code.toLowerCase().replace(/\s/g, "") === "charlesstreet" &&
      isChecked
    ) {
      setAccessGranted(true)
    } else if (!isChecked) {
      Alert.alert(
        "Agreement Required",
        "Please solemnly swear that you are up to no good."
      )
    } else {
      Alert.alert("Invalid Code", "Please try again.")
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>👀</Text>
        <Text style={styles.title}>
          You are about to get early access to the TMI App
        </Text>
        <Text style={styles.description}>
          Since you're getting it so early, there may be bugs. Let Maayan and
          Anjay know what you like/don't like/can't stand/are obsessed with, so
          we can make it even better.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Code"
          placeholderTextColor="#999"
          value={code}
          onChangeText={(text: string) => setCode(text)}
        />
        <View style={styles.checkboxContainer}>
          <CustomCheckbox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
          />
          <Text style={styles.checkboxLabel}>
            I solemnly swear that I am up to no good
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Get In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    fontSize: 72,
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 0,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
})

export default IntroScreen

export const useAccessGranted = () => {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(true)

  useEffect(() => {
    const loadAccessGranted = async () => {
      try {
        const storedValue = await AsyncStorage.getItem("accessGranted")
        setAccessGranted(storedValue ? JSON.parse(storedValue) : false)
      } catch (error) {
        console.error("Error loading access granted state:", error)
        setAccessGranted(false)
      }
    }

    loadAccessGranted()
  }, [])

  useEffect(() => {
    const saveAccessGranted = async () => {
      try {
        if (accessGranted !== null) {
          await AsyncStorage.setItem(
            "accessGranted",
            JSON.stringify(accessGranted)
          )
        }
      } catch (error) {
        console.error("Error saving access granted state:", error)
      }
    }

    saveAccessGranted()
  }, [accessGranted])

  return {
    accessGranted,
    setAccessGranted: (value: boolean) => setAccessGranted(value),
  }
}
