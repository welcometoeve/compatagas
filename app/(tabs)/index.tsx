import React, { useEffect, useRef, useState } from "react"
import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Animated,
  Easing,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native"
import { useAlbum } from "@/contexts/AlbumContext"
import LowerButtons from "@/components/camera/LowerButtons"
import TopNavBar from "@/components/camera/TopNavBar"
import * as Haptics from "expo-haptics"
import { FlashMode } from "expo-camera/build/legacy/Camera.types"
import { Ionicons } from "@expo/vector-icons"
import { usePhoto } from "@/contexts/photo/PhotoContext"
import ViewFinderLines from "@/components/camera/ViewFinderLines"

const MAX_SHOTS = 10

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back")
  const [permission, requestPermission] = useCameraPermissions()
  const scaleAnim = useRef(new Animated.Value(1)).current
  const whiteFlashAnim = useRef(new Animated.Value(0)).current
  const cameraRef = useRef<CameraView>(null)
  const { addPhoto, setPhotosTaken, photosTaken } = usePhoto()
  const { albums, currentAlbumId, createAlbum } = useAlbum()
  const [modalVisible, setModalVisible] = useState(false)
  const [newAlbumName, setNewAlbumName] = useState("")
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null)

  useEffect(() => {
    if (!permission) {
      requestPermission()
    }
  }, [permission])

  if (!permission) {
    return null
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Camera access is required. Please enable camera permissions in
          settings.
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  async function takePhoto() {
    if (photosTaken >= MAX_SHOTS) return

    if (cameraRef.current) {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

        const photo = await cameraRef.current.takePictureAsync()
        if (photo) {
          if (!currentAlbumId) {
            setPendingPhoto(photo.uri)
            const defaultName = `Album ${albums.length + 1}`
            setNewAlbumName(defaultName)
            setModalVisible(true)
          } else {
            addPhoto(photo.uri)
            setPhotosTaken((prev) => prev + 1)
          }

          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start()
        }
      } catch (error) {
        console.error("Error taking photo:", error)
      }
    }
  }

  function handleCancel() {
    setModalVisible(false)
    setNewAlbumName("")
    setPendingPhoto(null)
  }

  function handleCreateAlbum() {
    if (newAlbumName.trim() !== "") {
      if (pendingPhoto) {
        addPhoto(pendingPhoto, newAlbumName)
        setPhotosTaken((prev) => prev + 1)
      }
      setModalVisible(false)
      setNewAlbumName("")
      setPendingPhoto(null)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          flash="on"
        >
          <Animated.View
            style={[
              styles.whiteFlash,
              {
                opacity: whiteFlashAnim,
              },
            ]}
          />
          {!currentAlbumId && (
            <Text style={styles.cameraText}>
              Take a photo to create a new event
            </Text>
          )}
          <ViewFinderLines />
        </CameraView>
      </View>
      <View style={{ position: "absolute", width: "100%" }}>
        <TopNavBar scaleAnim={scaleAnim} />
      </View>

      <View style={styles.overlay}>
        <LowerButtons
          albumName={
            albums.find((album) => album.id === currentAlbumId)?.name ??
            "No current Album"
          }
          takePhoto={takePhoto}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}
        style={{ backgroundColor: "black" }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Name your new album</Text>
            <TextInput
              style={styles.input}
              onChangeText={setNewAlbumName}
              value={newAlbumName}
              placeholder="Enter album name"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleCreateAlbum}
              >
                <Text style={styles.buttonText}>Create Album</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 4,
    overflow: "hidden",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    marginBottom: 0,
  },
  whiteFlash: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
  },
  cameraText: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
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
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
})
