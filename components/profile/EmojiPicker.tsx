import React from "react"
import { View, TouchableOpacity, Text, StyleSheet, Modal } from "react-native"
import EmojiSelector from "react-native-emoji-selector"

interface EmojiPickerProps {
  isVisible: boolean
  onClose: () => void
  onEmojiSelected: (emoji: string) => void
  selectedEmoji: string
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isVisible,
  onClose,
  onEmojiSelected,
  selectedEmoji,
}) => {
  const handleSelectEmoji = (emoji: string) => {
    onEmojiSelected(emoji)
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Done</Text>
        </TouchableOpacity>
        <View style={styles.emojiPickerContainer}>
          <EmojiSelector
            onEmojiSelected={handleSelectEmoji}
            showSearchBar={true}
            showHistory={false}
            showSectionTitles={false}
            showTabs={false}
            columns={6}
            category={undefined}
          />
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
  },
  emojiPickerContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    height: 300,
    overflow: "hidden",
    marginTop: 220,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 160,
    right: "5%",
    zIndex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  closeButtonText: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
})

export default EmojiPicker
