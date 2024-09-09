import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, Octicons } from "@expo/vector-icons"
import { useAlbum } from "@/contexts/AlbumContext"
import ShareCodeModal from "../modals/ShareCodeModal"
import JoinAlbumModal from "../modals/JoinAlbumModal"
import { usePhoto } from "@/contexts/photo/PhotoContext"
import { BlurView } from "expo-blur"

interface TopNavBarProps {
  scaleAnim: Animated.Value
}

interface GlassPaneBackgroundProps {
  children: React.ReactNode
  style?: ViewStyle
}

const GlassPaneBackground: React.FC<GlassPaneBackgroundProps> = ({
  children,
  style,
}) => (
  <BlurView intensity={20} tint="dark" style={[styles.glassPane, style]}>
    {children}
  </BlurView>
)

const TopNavBar: React.FC<TopNavBarProps> = ({ scaleAnim }) => {
  const { currentAlbumId, albums } = useAlbum()
  const { photosTaken } = usePhoto()
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [joinModalVisible, setJoinModalVisible] = useState(false)

  const currentAlbum = albums.find((album) => album.id === currentAlbumId)
  const showLock = photosTaken === 0

  const toggleShareModal = () => {
    setShareModalVisible(!shareModalVisible)
  }

  const toggleJoinModal = () => {
    setJoinModalVisible(!joinModalVisible)
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {currentAlbumId ? (
          <>
            <Animated.View
              style={[styles.albumContainer, { alignSelf: "flex-start" }]}
            >
              <GlassPaneBackground>
                <View style={styles.albumNameContainer}>
                  <Text style={styles.albumNameText}>{currentAlbum?.name}</Text>
                  {showLock && (
                    <Ionicons
                      name="lock-closed"
                      size={18}
                      color="white"
                      style={styles.icon}
                    />
                  )}
                </View>
              </GlassPaneBackground>
            </Animated.View>
            <TouchableOpacity onPress={toggleShareModal} style={styles.button}>
              <GlassPaneBackground style={styles.buttonContent}>
                <Octicons name="share" size={20} color="white" />
                <Text style={styles.buttonText}>Share</Text>
              </GlassPaneBackground>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={toggleJoinModal} style={styles.button}>
            <GlassPaneBackground style={styles.buttonContent}>
              <Ionicons name="enter-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Join Album</Text>
            </GlassPaneBackground>
          </TouchableOpacity>
        )}
      </View>

      <ShareCodeModal
        isVisible={shareModalVisible}
        onClose={toggleShareModal}
      />

      <JoinAlbumModal isVisible={joinModalVisible} onClose={toggleJoinModal} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  albumContainer: {
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  albumNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  albumNameText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  icon: {
    marginLeft: 8,
  },
  button: {
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  buttonContent: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  glassPane: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})

export default TopNavBar
