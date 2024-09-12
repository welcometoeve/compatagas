import { AlertTriangle, CheckCircle } from "lucide-react-native"
import { View, Text } from "react-native"

export const CustomAlert: React.FC<{
  title: string
  description: string
  variant: "warning" | "info" | "success"
}> = ({ title, description, variant }) => (
  <View
    style={{
      padding: 16,
      borderRadius: 8,
      backgroundColor:
        variant === "warning"
          ? "#7c2d12"
          : variant === "success"
          ? "#065f46"
          : "#1f2937",
      borderColor:
        variant === "warning"
          ? "#ca8a04"
          : variant === "success"
          ? "#10b981"
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
    <Text style={{ fontWeight: "bold", color: "white" }}>{title}</Text>
    <Text style={{ color: "white" }}>{description}</Text>
  </View>
)
