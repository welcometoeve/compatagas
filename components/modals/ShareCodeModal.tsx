import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAlbum } from "@/contexts/AlbumContext"

interface ShareCodeModalProps {
  isVisible: boolean
  onClose: () => void
}

const ShareCodeModal: React.FC<ShareCodeModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { albums, currentAlbumId } = useAlbum()

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Share Album</Text>
          <Text selectable style={styles.codeText}>
            {albums.find((album) => album.id === currentAlbumId)?.share_code}
          </Text>
          <Text style={styles.modalText}>
            Use this 4-digit code to share the album
          </Text>
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
  codeText: {
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 20,
    letterSpacing: 5,
  },
  modalText: {
    marginTop: 15,
    textAlign: "center",
  },
})

export default ShareCodeModal
