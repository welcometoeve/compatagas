import React from "react"
import { View, Text, StyleSheet } from "react-native"

interface NotificationDotProps {
  count: number
  showCount?: boolean
}

const NotificationDot: React.FC<NotificationDotProps> = ({
  count,
  showCount = true,
}) => {
  if (count === 0) return null

  return (
    <View
      style={[
        styles.notificationDot,
        !showCount ? { width: 25, height: 25 } : {},
        !showCount ? { borderColor: "white", borderWidth: 3 } : {},
      ]}
    >
      {showCount && <Text style={styles.notificationText}>{count}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  notificationDot: {
    backgroundColor: "#FF4457",
    borderRadius: 30,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    zIndex: 10,
  },
  notificationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
})

export default NotificationDot
