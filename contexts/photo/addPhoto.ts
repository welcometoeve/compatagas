import { createClient } from "@supabase/supabase-js"

export interface Photo {
  id: number
  url: string
  status: "local" | "uploading" | "uploaded" | "error"
  albumId: number
  user_id: number
  user_name: string
  created_at: string
  localUri?: string
  dev_time: string
  caption?: string
}

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!
)

const generateTempId = (): number => {
  return Date.now()
}

const calculateDevTime = (createdAt: string): string => {
  const createdDate = new Date(createdAt)
  createdDate.setMinutes(createdDate.getMinutes() + 5)
  return createdDate.toISOString()
}

export const addPhoto = async (
  uri: string,
  albumId: number,
  user: { id: number; name: string | null },
  setCurrentPhotos: React.Dispatch<React.SetStateAction<Photo[]>>
) => {
  if (!user) {
    console.error("User not authenticated")
    return
  }

  const tempId: number = generateTempId()
  const created_at = new Date().toISOString()
  const newPhoto: Photo = {
    id: tempId,
    url: uri,
    status: "local",
    albumId: albumId,
    user_id: user.id,
    user_name: user.name || "Unknown",
    created_at: created_at,
    localUri: uri,
    dev_time: calculateDevTime(created_at),
  }

  setCurrentPhotos((prevPhotos) =>
    [...prevPhotos, newPhoto].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  )

  try {
    setCurrentPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === tempId ? { ...photo, status: "uploading" } : photo
      )
    )

    const response = await fetch(uri)
    const blob = await response.blob()
    const arrayBuffer = await new Response(blob).arrayBuffer()

    const fileName = `${tempId}.jpg`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(fileName)

    const { data: insertedPhoto, error: insertError } = await supabase
      .from("Photo")
      .insert({
        url: publicUrl,
        albumId: albumId,
        user_id: user.id,
        created_at: newPhoto.created_at,
        dev_time: newPhoto.dev_time,
      })
      .select()
      .single()

    if (insertError) throw insertError

    setCurrentPhotos((prevPhotos) =>
      prevPhotos
        .map((photo) =>
          photo.id === tempId
            ? { ...photo, ...insertedPhoto, status: "uploaded" }
            : photo
        )
        .sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
    )
  } catch (error) {
    console.error("Error uploading photo:", error)
    setCurrentPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === tempId ? { ...photo, status: "error" } : photo
      )
    )
    throw new Error("Failed to upload photo. Please try again.")
  }
}
