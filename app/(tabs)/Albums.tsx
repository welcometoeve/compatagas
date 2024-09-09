import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Album, useAlbum } from "@/contexts/AlbumContext"
import { usePage } from "@/contexts/PageContext"
import { Image } from "expo-image"
import { BlurView } from "expo-blur"
import { usePhoto } from "@/contexts/photo/PhotoContext"

const { width } = Dimensions.get("window")
const albumWidth = width / 2 - 16 * 3

const Albums: React.FC = () => {
  const { albums, setSelectedAlbumId, currentAlbumId } = useAlbum()
  const { setPage } = usePage()
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const { currentPhotos } = usePhoto()

  const getHeaderUrl = (album: Album) => {
    return currentAlbumId === album.id
      ? currentPhotos[0].localUri ?? currentPhotos[0].url
      : album.header_image_url
  }

  const renderAlbum = ({ item }: { item: Album }) => (
    <TouchableOpacity
      key={`album-${item.id}`}
      style={styles.albumContainer}
      onPress={() => {
        setSelectedAlbumId(item.id)
        setPage("album")
      }}
    >
      {getHeaderUrl(item) ? (
        <View style={styles.albumCover}>
          <Image
            source={{ uri: getHeaderUrl(item)! }}
            style={[
              styles.albumCover,
              loadedImages.has(getHeaderUrl(item)!)
                ? styles.imageLoaded
                : styles.imageLoading,
            ]}
            contentFit="cover"
            transition={300}
            onLoad={() => {
              setLoadedImages((prev) => new Set(prev).add(getHeaderUrl(item)!!))
            }}
          />
          {currentAlbumId === item.id &&
            new Date(currentPhotos[0].dev_time) > new Date() && (
              <BlurView
                intensity={40}
                tint="light"
                style={StyleSheet.absoluteFill}
              />
            )}
        </View>
      ) : (
        <View style={styles.placeholderCover}>
          <ActivityIndicator color="#ffffff" />
        </View>
      )}
      <Text style={styles.albumTitle} numberOfLines={2} ellipsizeMode="tail">
        {item.name}
      </Text>
    </TouchableOpacity>
  )

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  )

  const renderNewAlbumPlaceholder = () => (
    <TouchableOpacity
      style={[styles.albumContainer, styles.newAlbumPlaceholder]}
      onPress={() => {
        setPage("camera")
      }}
    >
      <Text style={styles.newAlbumPlus}>+</Text>
    </TouchableOpacity>
  )

  const sortedAlbums = albums.sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  )

  const sections = [
    {
      title: "Current",
      data: sortedAlbums.filter((album) => album.id === currentAlbumId),
    },
    {
      title: "Past",
      data: sortedAlbums.filter((album) => album.id !== currentAlbumId),
    },
  ]

  const renderItem = ({
    item,
    index,
  }: {
    item: { title: string; data: Album[] }
    index: number
  }) => (
    <View key={`section-${index}`}>
      {renderSectionHeader({ section: item })}
      {item.title === "Current" && item.data.length === 0 ? (
        <View style={styles.albumsRow}>{renderNewAlbumPlaceholder()}</View>
      ) : item.data.length > 0 ? (
        <View style={styles.albumsRow}>
          {item.data.map((album) => renderAlbum({ item: album }))}
        </View>
      ) : (
        item.title === "Past" && (
          <Text style={styles.noAlbumsText}>No past albums yet</Text>
        )
      )}
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => `section-${index}`}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  listContainer: {
    padding: 16,
    paddingTop: 32,
  },
  sectionHeader: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  albumsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    marginBottom: 24,
  },
  albumContainer: {
    width: albumWidth,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  albumCover: {
    width: albumWidth,
    height: albumWidth,
    borderRadius: 8,
    overflow: "hidden",
  },
  imageLoading: {
    opacity: 0,
  },
  imageLoaded: {
    opacity: 1,
  },
  placeholderCover: {
    width: albumWidth,
    height: albumWidth,
    backgroundColor: "dimgray",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  albumTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  noAlbumsText: {
    fontSize: 16,
    color: "white",
    textAlign: "left",
    marginTop: 16,
    marginLeft: 16,
  },
  newAlbumPlaceholder: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: albumWidth,
  },
  newAlbumPlus: {
    fontSize: 48,
    color: "white",
    marginBottom: 8,
  },
  newAlbumText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
})

export default Albums
