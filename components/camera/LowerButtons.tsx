import React from "react"
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { usePage } from "@/contexts/PageContext"
import { useAlbum } from "@/contexts/AlbumContext"
import { usePhoto } from "@/contexts/photo/PhotoContext"

interface LowerButtonsProps {
  albumName: string
  takePhoto: () => void
}

const LowerButtons: React.FC<LowerButtonsProps> = ({
  albumName,
  takePhoto,
}) => {
  const { currentPhotos, photosTaken, setSelectedPhotos } = usePhoto()
  const { setPage } = usePage()
  const { currentAlbumId, setSelectedAlbumId } = useAlbum()

  const lastPhoto = currentPhotos[currentPhotos.length - 1]
  const shotsLeft = 10 - photosTaken

  const handleTakePhoto = async () => {
    takePhoto()
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <View style={styles.buttonContainer}>
          <View style={styles.sideContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!currentAlbumId) return
                setSelectedAlbumId(currentAlbumId)
                setPage("album")
              }}
              style={[styles.previewButton, !currentAlbumId && { opacity: 0 }]}
              disabled={!currentAlbumId}
            >
              {lastPhoto && (
                <>
                  <Image
                    source={{ uri: lastPhoto.url }}
                    style={styles.previewImage}
                  />
                  {new Date(lastPhoto.dev_time) >= new Date() && (
                    <BlurView intensity={30} style={StyleSheet.absoluteFill} />
                  )}

                  {photosTaken === 0 && (
                    <MaterialCommunityIcons
                      name="lock"
                      size={24}
                      color="white"
                      style={styles.lockIcon}
                    />
                  )}
                </>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.centerContainer}>
            <TouchableOpacity
              style={styles.takePhotoButton}
              onPress={handleTakePhoto}
              disabled={photosTaken >= 10}
            >
              <View
                style={[
                  styles.takePhotoInner,
                  photosTaken >= 10 && styles.disabledButton,
                  (photosTaken === 0 || !currentAlbumId) && {
                    backgroundColor: "cyan",
                  },
                ]}
              />
              {photosTaken === 0 && (
                <View
                  style={[
                    styles.takePhotoInner,
                    {
                      position: "absolute",
                      backgroundColor: "black",
                      opacity: 0.2,
                    },
                  ]}
                />
              )}
              {!currentAlbumId ? (
                <Text style={styles.joinText}>Create</Text>
              ) : photosTaken === 0 ? (
                <Text style={styles.joinText}>Join</Text>
              ) : null}
            </TouchableOpacity>
          </View>

          <View
            style={[styles.sideContainer, { opacity: currentAlbumId ? 1 : 0 }]}
          >
            <View style={styles.shotsLeftContainer}>
              <Text style={styles.remainingShotsText}>{shotsLeft}</Text>
              <View style={styles.shotsTextContainer}>
                <Text style={styles.shotsText}>shots</Text>
                <Text style={styles.shotsText}>left</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 10,
  },
  buttonWrapper: {
    width: "100%",
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sideContainer: {
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  previewButton: {
    width: 55,
    height: (55 * 5) / 4, // Adjust the aspect ratio to match the album view (4:3)
    borderRadius: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  lockIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  centerContainer: {
    flex: 2,
    alignItems: "center",
  },
  takePhotoButton: {
    width: 98,
    height: 98,
    borderRadius: 5000,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "rgb(240, 240, 240)",
    borderWidth: 1,
  },
  takePhotoInner: {
    width: 75,
    height: 75,
    borderRadius: 500,
    backgroundColor: "rgb(240, 240, 240)",
    // borderColor: "white",
    // borderWidth: 2,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 6,
    // },
    // shadowOpacity: 0.5,
    // shadowRadius: 8,
    // elevation: 10,
  },
  disabledButton: {
    backgroundColor: "gray",
    borderColor: "darkgray",
  },
  joinText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
  },
  shotsLeftContainer: {
    height: 55,
    borderRadius: 5,
    overflow: "hidden",
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    flexDirection: "row",
    gap: 4,
    width: 100,
    marginRight: 5,
  },
  remainingShotsText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 40,
    fontStyle: "italic",
  },
  shotsTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  shotsText: {
    color: "white",
    textAlign: "left",
    fontSize: 13,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  developingText: {
    position: "absolute",
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    padding: 2,
    borderRadius: 4,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
})

export default LowerButtons
