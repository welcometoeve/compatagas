import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { useUser } from "./UserContext" // Import the useUser hook

// Initialize Supabase client
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!
)

export interface Album {
  id: number
  name: string
  created_at: string
  header_image_url: string | null
  share_code: string
}

interface AlbumContextType {
  selectedAlbumId?: number
  albums: Album[]
  setSelectedAlbumId: (id: number) => void
  currentAlbumId?: number
  createAlbum: (albumName: string) => Promise<number | undefined>
  fetchUserAlbums: () => Promise<void>
  findAlbum: (shareCode: string) => Promise<boolean | undefined>
}

const AlbumContext = createContext<AlbumContextType | null>(null)

export function useAlbum() {
  const context = useContext(AlbumContext)
  if (!context) {
    throw new Error("useAlbum must be used within an AlbumProvider")
  }
  return context
}

interface AlbumProviderProps {
  children: ReactNode
}

export function AlbumProvider({ children }: AlbumProviderProps) {
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | undefined>()
  const [albums, setAlbums] = useState<Album[]>([])
  const { user } = useUser() // Use the useUser hook to get the current user

  const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000)

  const sortedAlbums = albums.sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  )

  const currentAlbumId = sortedAlbums.find((album) => {
    const albumCreatedAt = new Date(album.created_at)
    return albumCreatedAt > eightHoursAgo
  })?.id

  const generateShareCode = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  const createAlbum = async (
    albumName: string
  ): Promise<number | undefined> => {
    try {
      const shareCode = generateShareCode()
      const { data, error } = await supabase
        .from("Album")
        .insert({ name: albumName, share_code: shareCode })
        .select()
        .single()

      if (error) throw error

      const newAlbum: Album = {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        header_image_url: null,
        share_code: data.share_code,
      }

      setAlbums((prevAlbums) => [newAlbum, ...prevAlbums])
      return data.id
    } catch (error) {
      console.error("Error creating new album:", error)
      return undefined
    }
  }

  const fetchUserAlbums = async () => {
    if (!user) {
      console.error("No user found. Cannot fetch albums.")
      return
    }

    try {
      const { data: albumsData, error: albumsError } = await supabase
        .from("Album")
        .select(
          `
          *,
          Photo!inner (*)
        `
        )
        .eq("Photo.user_id", user.id)
        .order("created_at", { ascending: false })

      if (albumsError) {
        throw albumsError
      }

      if (albumsData) {
        const uniqueAlbums = Array.from(
          new Map(albumsData.map((album) => [album.id, album])).values()
        )

        const updatedAlbums = await Promise.all(
          uniqueAlbums.map(async (album) => {
            // Fetch the most recent photo for this album
            const { data: photoData, error: photoError } = await supabase
              .from("Photo")
              .select("url")
              .eq("albumId", album.id)
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single()

            if (photoError && photoError.code !== "PGRST116") {
              console.error("Error fetching album header photo:", photoError)
            }

            return {
              ...album,
              header_image_url: photoData?.url || null,
              share_code: album.share_code,
            }
          })
        )

        setAlbums(updatedAlbums)
      }
    } catch (error) {
      console.error("Error fetching user albums:", error)
    }
  }

  const findAlbum = async (shareCode: string) => {
    try {
      const { data, error } = await supabase
        .from("Album")
        .select("*")
        .eq("share_code", shareCode)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log("No album found with the given share code")
          return
        }
        throw error
      }

      if (data) {
        const newAlbum: Album = {
          id: data.id,
          name: data.name,
          created_at: data.created_at,
          header_image_url: data.header_image_url,
          share_code: data.share_code,
        }

        // Check if the album already exists in the list
        const albumExists = albums.some((album) => album.id === newAlbum.id)

        if (!albumExists) {
          setAlbums((prevAlbums) => [newAlbum, ...prevAlbums])
          console.log("Album added to the list:", newAlbum)
        } else {
          console.log("Album already exists in the list")
        }
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("Error finding album:", error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUserAlbums()
    }
  }, [user])

  useEffect(() => {
    // Set up real-time subscription for Album table
    const albumSubscription = supabase
      .channel("album_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Album" },
        (payload) => {
          fetchUserAlbums() // Refetch all albums when a change occurs
        }
      )
      .subscribe()

    // Set up real-time subscription for Photo table
    const photoSubscription = supabase
      .channel("photo_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Photo" },
        (payload) => {
          fetchUserAlbums() // Refetch all albums when a new photo is added
        }
      )
      .subscribe()

    // Clean up subscriptions on unmount
    return () => {
      albumSubscription.unsubscribe()
      photoSubscription.unsubscribe()
    }
  }, [user])

  return (
    <AlbumContext.Provider
      value={{
        selectedAlbumId,
        albums,
        setSelectedAlbumId,
        currentAlbumId,
        createAlbum,
        fetchUserAlbums,
        findAlbum,
      }}
    >
      {children}
    </AlbumContext.Provider>
  )
}
