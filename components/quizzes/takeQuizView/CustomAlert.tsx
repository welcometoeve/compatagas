import { AlertTriangle, CheckCircle, Users } from "lucide-react-native"
import { View, Text } from "react-native"

export const CustomAlert: React.FC<{
  title: string
  description: string
  variant: "warning" | "info" | "success" | "friends"
  friends?: string[]
}> = ({ title, description, variant, friends }) => (
  <View
    style={{
      padding: 16,
      borderRadius: 8,
      backgroundColor:
        variant === "warning"
          ? "#7c2d12"
          : variant === "success"
          ? "#065f46"
          : variant === "friends"
          ? "#4c1d95" // Changed to a purple color
          : "#1f2937",
      borderColor:
        variant === "warning"
          ? "#ca8a04"
          : variant === "success"
          ? "#10b981"
          : variant === "friends"
          ? "#8b5cf6" // Changed to a lighter purple for contrast
          : "#a78bfa",
      borderWidth: 1,
      marginTop: 16,
    }}
  >
    {variant === "warning" && (
      <AlertTriangle size={16} color="white" style={{ marginBottom: 8 }} />
    )}
    {variant === "success" && (
      <CheckCircle size={16} color="white" style={{ marginBottom: 8 }} />
    )}
    {variant === "friends" && (
      <Users size={16} color="white" style={{ marginBottom: 8 }} />
    )}
    <Text style={{ fontWeight: "bold", color: "white" }}>{title}</Text>
    {variant !== "friends" && (
      <Text style={{ color: "white" }}>{description}</Text>
    )}
    {variant === "friends" && friends && friends.length > 0 && (
      <View style={{ marginTop: 4 }}>
        <Text style={{ color: "white" }}>
          {friends.map((friend, index) => friend).join(", ")}
        </Text>
      </View>
    )}
  </View>
)
