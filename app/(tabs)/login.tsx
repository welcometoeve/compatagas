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

const AccountScreen = () => {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState<number | undefined>()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { createUser, signingUp } = useUser()

  const handleSubmit = async () => {
    setError("")
    setSuccess(false)

    if (!name || phoneNumber === undefined) {
      setError("Please fill in all fields.")
      return
    }

    try {
      await createUser(phoneNumber, name)
      setSuccess(true)
    } catch (err) {
      setError("Failed to create account. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#a0aec0"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber as any}
              onChangeText={(phoneNumber: string) =>
                setPhoneNumber(parseInt(phoneNumber))
              }
              placeholder="Enter your phone number"
              placeholderTextColor="#a0aec0"
              keyboardType="phone-pad"
            />
          </View>
          <TouchableOpacity
            style={[styles.button, signingUp && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={signingUp}
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
    backgroundColor: "#000",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: height / 10,
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#000",
    borderRadius: 20, // Increased border radius
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    borderColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20, // Increased margin for more space
  },
  label: {
    fontSize: 16, // Increased font size
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#111",
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 12, // Increased border radius
    padding: 16, // Increased padding
    color: "#fff",
    fontSize: 18, // Increased font size
    height: 60, // Increased height
  },
  button: {
    backgroundColor: "#000",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 12, // Increased border radius
    padding: 16, // Increased padding
    alignItems: "center",
    marginTop: 24, // Increased margin
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18, // Increased font size
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#000",
    borderColor: "#e53e3e",
    borderWidth: 1,
    borderRadius: 12, // Increased border radius
    padding: 16, // Increased padding
    marginTop: 24, // Increased margin
  },
  errorTitle: {
    color: "#e53e3e",
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16, // Increased font size
  },
  errorText: {
    color: "#e53e3e",
    fontSize: 14, // Increased font size
  },
  successContainer: {
    backgroundColor: "#000",
    borderColor: "#38a169",
    borderWidth: 1,
    borderRadius: 12, // Increased border radius
    padding: 16, // Increased padding
    marginTop: 24, // Increased margin
  },
  successTitle: {
    color: "#38a169",
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16, // Increased font size
  },
  successText: {
    color: "#38a169",
    fontSize: 14, // Increased font size
  },
})

export default AccountScreen
