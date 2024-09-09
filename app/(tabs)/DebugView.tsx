import React from "react"
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Button,
  AppState,
} from "react-native"
import { UpdateCheckResult } from "expo-updates"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import { usePhoto } from "@/contexts/photo/PhotoContext"

interface DebugViewProps {
  isVisible: boolean
  onClose: () => void
  update: UpdateCheckResult | null
  updateString: string
}

export function DebugView({
  isVisible,
  onClose,
  update,
  updateString,
}: DebugViewProps) {
  const { setPhotosTaken } = usePhoto()

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.debugContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={styles.debugTitle}>Debug Information</Text>
        <Text style={styles.debugText}>App State: {AppState.currentState}</Text>
        <Text style={styles.debugText}>Update: {JSON.stringify(update)}</Text>
        {update && (
          <Text style={styles.debugText}>
            Update Info: {JSON.stringify(update, null, 2)}
          </Text>
        )}
        <Text style={styles.debugText} selectable>
          {updateString}
        </Text>
        <Button
          title="Clear Photo Taken"
          onPress={() => {
            setPhotosTaken(0)
            onClose()
          }}
        />
        <Button
          title="Clear Local Storage"
          onPress={() => {
            AsyncStorage.clear()
            onClose()
          }}
        />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  debugContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  debugTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  debugText: {
    color: "#FFFFFF",
    marginBottom: 10,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
    borderRadius: 15,
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
})
