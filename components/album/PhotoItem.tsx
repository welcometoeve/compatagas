import React, { useState, useRef, useEffect } from "react"
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from "react-native"
import { BlurView } from "expo-blur"
import { Image } from "expo-image"
import { Photo } from "@/contexts/photo/addPhoto"
import { useUser } from "@/contexts/UserContext"
import { usePhoto } from "@/contexts/photo/PhotoContext"
import { Entypo, Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

interface PhotoItemProps {
  photo: Photo
  isLastOdd: boolean
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, isLastOdd }) => {
  const { user } = useUser()
  const { updateCaption } = usePhoto()
  const [modalVisible, setModalVisible] = useState(false)
  const [newCaption, setNewCaption] = useState(photo.caption || "")
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (modalVisible && inputRef.current) {
      inputRef.current.focus()
    }
  }, [modalVisible])

  const handleOpenModal = () => {
    setModalVisible(true)
  }

  const handleCloseModal = () => {
    setModalVisible(false)
    setNewCaption(photo.caption || "")
  }

  const handleSaveCaption = async () => {
    try {
      await updateCaption(photo.id, newCaption)
      setModalVisible(false)
    } catch (error) {
      console.error("Failed to update caption:", error)
      // You might want to show an error message to the user here
    }
  }

  const renderCaption = () => {
    if (photo.user_id === user?.id && new Date(photo.dev_time) < new Date()) {
      if (photo.caption) {
        return (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
            onPress={handleOpenModal}
          >
            <Text style={styles.captionText}>{photo.caption}</Text>
            {/* <Entypo name={"pencil"} size={14} color={"dodgerblue"} /> */}
          </TouchableOpacity>
        )
      } else {
        return (
          <TouchableOpacity onPress={handleOpenModal}>
            <Text style={[styles.captionText, styles.addCaptionText]}>
              Add Caption...
            </Text>
          </TouchableOpacity>
        )
      }
    } else if (photo.caption) {
      return (
        <View>
          <Text style={styles.captionText}>{photo.caption}</Text>
        </View>
      )
    }
    return null
  }

  return (
    <View
      style={[styles.photoContainer, isLastOdd && styles.lastPhotoContainer]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photo.localUri || photo.url }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
        {new Date(photo.dev_time) >= new Date() && (
          <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="dark">
            <View style={styles.developingOverlay}>
              <Text style={styles.developingText}>Developing...</Text>
            </View>
          </BlurView>
        )}
        <View style={styles.captionContainer}>{renderCaption()}</View>
      </View>
      <Text style={styles.userNameText}>By {photo.user_name}</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: photo.localUri || photo.url }}
              style={styles.modalImage}
              contentFit="cover"
            />
            <TextInput
              ref={inputRef}
              style={styles.captionInput}
              value={newCaption}
              onChangeText={setNewCaption}
              placeholder="Add a caption..."
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={handleCloseModal} />
              <Button title="Save" onPress={handleSaveCaption} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  photoContainer: {
    width: width / 2 - 10,
    marginBottom: 20,
  },
  lastPhotoContainer: {
    marginRight: "auto",
  },
  imageContainer: {
    width: "100%",
    height: (width / 2 - 25) * (3 / 2),
    borderRadius: 0,
    overflow: "hidden",
    position: "relative",
    borderColor: "white",
    borderWidth: 2,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  captionContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "white",
    height: 40,
  },
  captionText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  addCaptionText: {
    color: "dodgerblue",
    fontSize: 15,
  },
  editIcon: {
    marginLeft: 5,
  },
  developingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  developingText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userNameText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingTop: 75,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    paddingBottom: 15,
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
  modalImage: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  captionInput: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
})

export default PhotoItem
