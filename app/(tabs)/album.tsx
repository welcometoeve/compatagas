import React, { useEffect, useState } from "react"
import { View, StyleSheet, Text, Dimensions, ScrollView } from "react-native"
import { BlurView } from "expo-blur"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAlbum } from "@/contexts/AlbumContext"
import { usePhoto } from "@/contexts/photo/PhotoContext"
import AlbumHeader from "@/components/album/AlbumHeader"
import PhotoItem from "@/components/album/PhotoItem"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

export default function Album() {
  const { photosTaken, selectedPhotos, currentPhotos } = usePhoto()
  const [cachedPhotos, setCachedPhotos] = useState<string[]>([])
  const { selectedAlbumId, currentAlbumId } = useAlbum()

  const photos =
    selectedAlbumId === currentAlbumId ? currentPhotos : selectedPhotos

  useEffect(() => {
    const loadCachedPhotos = async () => {
      try {
        const storedPhotos = await AsyncStorage.getItem("cachedPhotos")
        if (storedPhotos) {
          setCachedPhotos(JSON.parse(storedPhotos))
        }
      } catch (error) {
        console.error("Error loading cached photos:", error)
      }
    }

    loadCachedPhotos()
  }, [])

  useEffect(() => {
    const cachePhotos = async () => {
      const newCachedPhotos = photos.map((photo) => photo.localUri || photo.url)
      const updatedCachedPhotos = [
        ...new Set([...cachedPhotos, ...newCachedPhotos]),
      ]

      setCachedPhotos(updatedCachedPhotos)

      try {
        await AsyncStorage.setItem(
          "cachedPhotos",
          JSON.stringify(updatedCachedPhotos)
        )
      } catch (error) {
        console.error("Error saving cached photos:", error)
      }
    }

    cachePhotos()
  }, [photos])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AlbumHeader />
        <View style={styles.photoGrid}>
          {[...photos].reverse().map((photo, index) => (
            <PhotoItem
              key={photo.localUri || photo.url}
              photo={photo}
              isLastOdd={index === photos.length - 2 && photos.length % 2 !== 0}
            />
          ))}
        </View>
      </ScrollView>
      {photosTaken === 0 && selectedAlbumId === currentAlbumId && (
        <BlurView intensity={40} style={StyleSheet.absoluteFill}>
          <View style={styles.overlay}>
            <Ionicons name="camera" size={40} color="white" />
            <Text style={styles.overlayText}>Take a Photo to</Text>
            <Text style={styles.overlayText}>Access the Album</Text>
          </View>
        </BlurView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollContent: {
    flexGrow: 1,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    padding: 0,
    marginBottom: 0,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlayText: {
    color: "#ffffff",
    fontSize: 25,
    marginTop: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
})
