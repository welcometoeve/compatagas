import React from "react"
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Button,
  AppState,
  Switch,
} from "react-native"
import { UpdateCheckResult } from "expo-updates"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useUser } from "@/contexts/UserContext"
import { useEnvironment } from "@/contexts/EnvironmentContext"

interface DebugViewProps {
  isVisible: boolean
  onClose: () => void
  update: UpdateCheckResult | null
  updateString: string
  setAccessGranted: (value: boolean) => void
}

export function DebugView({
  isVisible,
  onClose,
  update,
  updateString,
  setAccessGranted,
}: DebugViewProps) {
  const { clearUser } = useUser()
  const { user } = useUser()
  const { isDev, setDev } = useEnvironment()
  const { setRefresh, refresh } = useEnvironment()

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
          <Text style={styles.debugText} selectable>
            Update Info: {JSON.stringify(update, null, 2)}
          </Text>
        )}
        <Text style={styles.debugText} selectable>
          {updateString}
        </Text>
        <Text style={styles.debugText}>User Name: {user?.name}</Text>
        <Text style={styles.debugText}>User Id: {user?.id}</Text>
        <Text style={styles.debugText}>
          User Phone Number: {user?.phoneNumber}
        </Text>

        <View style={styles.toggleContainer}>
          <Text style={styles.debugText}>{`isDev:${isDev}`} </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDev ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async () => {
              setDev(!isDev)
            }}
            value={isDev}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "gray" }]}
            onPress={() => {
              AsyncStorage.clear()
              clearUser()
              setAccessGranted(false)
              onClose()
            }}
          >
            <Text style={styles.buttonText}>Get OUT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setRefresh(refresh + 1)
            }}
          >
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              AsyncStorage.removeItem("phoneNumber")
              clearUser()
              onClose()
            }}
          >
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
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
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    marginBottom: 30,
    alignContent: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "dodgerblue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
})
