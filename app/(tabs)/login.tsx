import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useUser } from "@/contexts/UserContext"
import getRandomEmoji from "../../components/profile/getRandomEmoji"

const AccountScreen = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState<number | undefined>()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { createUser, signingUp } = useUser()

  const handleSubmit = async () => {
    setError("")
    setSuccess(false)

    if (!firstName || !lastName || phoneNumber === undefined) {
      setError("Please fill in all fields.")
      return
    }

    try {
      await createUser(phoneNumber, firstName, lastName)
      setSuccess(true)
    } catch (err) {
      setError("Failed to create account. Please try again.")
    }
  }

  const isFormValid =
    firstName !== "" && lastName !== "" && phoneNumber !== undefined

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              placeholderTextColor="#999999"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              placeholderTextColor="#999999"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={phoneNumber as any}
              onChangeText={(phoneNumber: string) =>
                setPhoneNumber(parseInt(phoneNumber))
              }
              placeholder="Phone number"
              placeholderTextColor="#999999"
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              (!isFormValid || signingUp) && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || signingUp}
          >
            <Text style={styles.buttonText}>
              {signingUp ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={styles.successContainer}>
              <Text style={styles.successTitle}>Success</Text>
              <Text style={styles.successText}>
                Account created successfully!
              </Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const { height } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: height / 10,
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
    marginBottom: 8,
  },
  input: {
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    color: "#333333",
    fontSize: 18,
    height: 60,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#fff5f5",
    borderColor: "#feb2b2",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  errorTitle: {
    color: "#c53030",
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  errorText: {
    color: "#c53030",
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: "#f0fff4",
    borderColor: "9ae6b4",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  successTitle: {
    color: "#2f855a",
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
  },
  successText: {
    color: "#2f855a",
    fontSize: 14,
  },
})

export default AccountScreen
