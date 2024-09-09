import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  ViewStyle,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAlbum } from "@/contexts/AlbumContext"

interface JoinAlbumModalProps {
  isVisible: boolean
  onClose: () => void
}

const JoinAlbumModal: React.FC<JoinAlbumModalProps> = ({
  isVisible,
  onClose,
}) => {
  const [joinCode, setJoinCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const { findAlbum } = useAlbum()

  const handleJoinAlbum = async () => {
    if (joinCode.length === 4) {
      setIsLoading(true)
      setMessage("")
      try {
        const result = await findAlbum(joinCode)
        if (result === true) {
          onClose()
        } else {
          setIsSuccess(false)
          setMessage(
            "Unable to find the album. Please check the code and try again."
          )
        }
      } catch (error) {
        console.error("Error joining album:", error)
        setIsSuccess(false)
        setMessage("An unexpected error occurred. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const resetState = () => {
    setJoinCode("")
    setMessage("")
    setIsSuccess(false)
  }

  const handleClose = () => {
    resetState()
    onClose()
  }

  const getButtonStyle = (): ViewStyle => {
    if (!message) return styles.joinButton
    return isSuccess
      ? { ...styles.joinButton, ...styles.successButton }
      : { ...styles.joinButton, ...styles.errorButton }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Join Album</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 4-digit code"
            placeholderTextColor="#999"
            value={joinCode}
            onChangeText={setJoinCode}
            keyboardType="number-pad"
            maxLength={4}
            editable={!isLoading}
          />
          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <TouchableOpacity
              onPress={handleJoinAlbum}
              style={getButtonStyle()}
              disabled={isLoading || joinCode.length !== 4}
            >
              <Text style={styles.joinButtonText}>
                {message ? (isSuccess ? "Success!" : "Try Again") : "Join"}
              </Text>
            </TouchableOpacity>
          )}
          {message && (
            <Text
              style={[
                styles.messageText,
                isSuccess ? styles.successText : styles.errorText,
              ]}
            >
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: 200,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  joinButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  joinButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  successButton: {
    backgroundColor: "#4CAF50",
  },
  errorButton: {
    backgroundColor: "#F44336",
  },
  messageText: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
  },
  successText: {
    color: "#4CAF50",
  },
  errorText: {
    color: "#F44336",
  },
})

export default JoinAlbumModal
