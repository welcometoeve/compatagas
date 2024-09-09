import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from "react"
import { AppState } from "react-native"
import { createClient } from "@supabase/supabase-js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Notifications from "expo-notifications"
import { addPhoto, Photo } from "./addPhoto"
import { useUser } from "../UserContext"
import { useAlbum } from "../AlbumContext"

interface PhotoContextType {
  currentPhotos: Photo[]
  selectedPhotos: Photo[]
  setSelectedPhotos: React.Dispatch<React.SetStateAction<Photo[]>>
  addPhoto: (uri: string, albumName?: string) => Promise<void>
  updateCaption: (photoId: number, caption: string) => Promise<void>
  photosTaken: number
  setPhotosTaken: React.Dispatch<React.SetStateAction<number>>
}

const PhotoContext = createContext<PhotoContextType | null>(null)

export function usePhoto() {
  const context = useContext(PhotoContext)
  if (!context) {
    throw new Error("usePhoto must be used within a PhotoProvider")
  }
  return context
}

interface PhotoProviderProps {
  children: ReactNode
}

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!
)

const calculateDevTime = (createdAt: string): string => {
  const createdDate = new Date(createdAt)
  createdDate.setMinutes(createdDate.getMinutes() + 5)
  return createdDate.toISOString()
}

Notifications.setNotificationHandler({
  handleNotification: async () => {
    const appState = AppState.currentState
    return {
      shouldShowAlert: appState !== "active",
      shouldPlaySound: appState !== "active",
      shouldSetBadge: true,
    }
  },
})

export function PhotoProvider({ children }: PhotoProviderProps) {
  const [currentPhotos, setCurrentPhotos] = useState<Photo[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([])
  const [photosTaken, setPhotosTaken] = useState<number>(0)
  const { selectedAlbumId, currentAlbumId, createAlbum } = useAlbum()
  const { user } = useUser()
  const notificationId = useRef<string | null>(null)

  useEffect(() => {
    // Request notification permissions
    Notifications.requestPermissionsAsync()

    // Set up notification handler
    const notificationSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification)
      })

    // Set up AppState change listener
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          // App has come to the foreground
          // You might want to refresh data or clear notifications here
        }
      }
    )

    return () => {
      notificationSubscription.remove()
      appStateSubscription.remove()
    }
  }, [])

  useEffect(() => {
    if (user && currentPhotos.length > 0) {
      const userPhotos = currentPhotos.filter(
        (photo) => photo.user_id === user.id
      )
      setPhotosTaken(userPhotos.length)
    }
  }, [user, currentPhotos])

  useEffect(() => {
    const developingPhotos = currentPhotos.filter(
      (photo) => new Date(photo.dev_time) > new Date()
    )

    if (developingPhotos.length > 0) {
      updateNotification(developingPhotos.length)
    } else if (notificationId.current) {
      Notifications.dismissNotificationAsync(notificationId.current)
      notificationId.current = null
    }
  }, [currentPhotos])

  const updateNotification = async (count: number) => {
    console.log(`Attempting to update notification with count: ${count}`)

    const notificationContent = {
      title: "Lapse",
      subtitle: "Snaps developed",
      body: "Review your photos",
      badge: count,
      data: { count: count },
    }

    console.log("Notification content:", notificationContent)

    if (notificationId.current) {
      console.log(`Dismissing previous notification: ${notificationId.current}`)
      await Notifications.dismissNotificationAsync(notificationId.current)
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: notificationContent,
        trigger: null,
      })
      notificationId.current = id
      console.log(`Notification scheduled with ID: ${id}`)
    } catch (error) {
      console.error("Error scheduling notification:", error)
    }
  }

  const subscribeToPhotos = async (
    albumId: number,
    setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>
  ) => {
    const photoChannel = supabase
      .channel("custom-photo-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Photo",
          filter: `albumId=eq.${albumId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPhotos((prevPhotos) => {
              const newPhoto = payload.new as Photo
              newPhoto.dev_time = calculateDevTime(newPhoto.created_at)
              const newPhotos = [...prevPhotos, newPhoto]
              return newPhotos.sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              )
            })
          } else if (payload.eventType === "UPDATE") {
            setPhotos((prevPhotos) =>
              prevPhotos.map((photo) =>
                photo.id === payload.new.id
                  ? {
                      ...photo,
                      ...payload.new,
                      dev_time: calculateDevTime(payload.new.created_at),
                    }
                  : photo
              )
            )
          } else if (payload.eventType === "DELETE") {
            setPhotos((prevPhotos) =>
              prevPhotos.filter((photo) => photo.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return photoChannel
  }

  useEffect(() => {
    const subscribeToChannels = async () => {
      if (user && selectedAlbumId) {
        await fetchAlbumData(selectedAlbumId, setSelectedPhotos)
        const photoChannel = await subscribeToPhotos(
          selectedAlbumId,
          setSelectedPhotos
        )

        return () => {
          supabase.removeChannel(photoChannel)
        }
      }

      if (user && currentAlbumId) {
        await fetchAlbumData(currentAlbumId, setCurrentPhotos)

        const photoChannel = await subscribeToPhotos(
          currentAlbumId,
          setCurrentPhotos
        )

        return () => {
          supabase.removeChannel(photoChannel)
        }
      }
    }

    subscribeToChannels()
  }, [selectedAlbumId, user, currentAlbumId])

  const fetchAlbumData = async (
    albumId: number,
    setPhotos: (photos: Photo[]) => void
  ) => {
    if (!albumId) return

    const { data, error } = await supabase
      .from("Photo")
      .select(
        `
        *,
        User:user_id (
          id,
          name
        )
      `
      )
      .eq("albumId", albumId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching album data:", error)
    } else if (data) {
      const photosWithUserNames = data.map((photo) => ({
        ...photo,
        user_name: photo.User.name,
        dev_time: calculateDevTime(photo.created_at),
      }))
      setPhotos(photosWithUserNames)
    }
  }

  const handleAddPhoto = async (uri: string, albumName?: string) => {
    if (!user) {
      console.error("User not authenticated")
      return
    }

    if (!currentAlbumId && !albumName) {
      console.error("Cannot create new album without a name")
      return
    }

    const albumId = currentAlbumId ?? (await createAlbum(albumName!))

    if (!albumId) {
      console.error("Could not access album id")
      return
    }

    try {
      await addPhoto(uri, albumId, user, setCurrentPhotos)
    } catch (error: any) {
      alert(error?.message)
    }
  }

  const updateCaption = async (photoId: number, caption: string) => {
    if (!user) {
      console.error("User not authenticated")
      return
    }

    try {
      const { data, error } = await supabase
        .from("Photo")
        .update({ caption })
        .eq("id", photoId)
        .select()

      if (error) throw error

      // Update local state
      setCurrentPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === photoId ? { ...photo, caption } : photo
        )
      )
      setSelectedPhotos((prevPhotos) =>
        prevPhotos.map((photo) =>
          photo.id === photoId ? { ...photo, caption } : photo
        )
      )
    } catch (error: any) {
      console.error("Error updating caption:", error.message)
      alert("Failed to update caption. Please try again.")
    }
  }

  return (
    <PhotoContext.Provider
      value={{
        currentPhotos,
        selectedPhotos,
        addPhoto: handleAddPhoto,
        updateCaption,
        photosTaken,
        setPhotosTaken,
        setSelectedPhotos,
      }}
    >
      {children}
    </PhotoContext.Provider>
  )
}
