import React, { useState } from "react"
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native"
import { Feather, Octicons } from "@expo/vector-icons"
import * as Clipboard from "expo-clipboard"
import { useAlbum } from "@/contexts/AlbumContext"
import { usePage } from "@/contexts/PageContext"
import ShareCodeModal from "../modals/ShareCodeModal"
import { usePhoto } from "@/contexts/photo/PhotoContext"

const { width, height } = Dimensions.get("window")

interface AlbumHeaderProps {}

const AlbumHeader: React.FC<AlbumHeaderProps> = () => {
  const { setPage } = usePage()
  const { selectedAlbumId, albums, currentAlbumId } = useAlbum()
  const [isQRModalVisible, setIsQRModalVisible] = useState(false)
  const { selectedPhotos } = usePhoto()

  const handleShare = async (): Promise<void> => {
    const inviteLink = "https://testflight.apple.com/join/wdCXnrAT"
    await Clipboard.setStringAsync(inviteLink)
    Alert.alert(
      "Link Copied",
      "The invite link has been copied to your clipboard."
    )
  }

  const handleQRCodePress = () => {
    setIsQRModalVisible(true)
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => setPage("albums")}
          style={styles.button}
        >
          <Feather
            name="chevron-left"
            size={36}
            color="white"
            style={styles.iconShadow}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.albumName} numberOfLines={2} adjustsFontSizeToFit>
        {albums.find((album) => album.id === selectedAlbumId)?.name ??
          "No album selected"}
      </Text>
      <View
        style={[
          styles.buttonContainer,
          { opacity: selectedAlbumId === currentAlbumId ? 1 : 0 },
        ]}
      >
        <TouchableOpacity
          onPress={handleQRCodePress}
          disabled={selectedAlbumId !== currentAlbumId}
          style={styles.button}
        >
          <Octicons
            name="share"
            size={30}
            color="#ffffff"
            style={styles.iconShadow}
          />
        </TouchableOpacity>
      </View>

      <ShareCodeModal
        isVisible={isQRModalVisible}
        onClose={() => setIsQRModalVisible(false)}
      />

      {selectedPhotos.filter((photo) => new Date(photo.dev_time) > new Date())
        .length > 0 && (
        <Text style={styles.developmentText}>
          Photos will be developed soon...
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: width,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  buttonContainer: {
    width: 50,
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  albumName: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  iconShadow: {
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  developmentText: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
})

export default AlbumHeader
