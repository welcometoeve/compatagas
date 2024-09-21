import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"

interface TooltipProps {
  isVisible: boolean
  content: string
  targetRef: React.RefObject<View>
}

const Tooltip: React.FC<TooltipProps> = ({ isVisible, content, targetRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const tooltipWidth = 250 // Adjust based on your needs

  useEffect(() => {
    if (isVisible && targetRef.current) {
      targetRef.current.measureInWindow((x, y, width, height) => {
        const windowWidth = Dimensions.get("window").width
        const targetCenter = x + width / 2
        const tooltipLeft = targetCenter - tooltipWidth / 2

        setPosition({
          top: y + height + 5,
          left: Math.max(
            10,
            Math.min(tooltipLeft, windowWidth - tooltipWidth - 10)
          ),
        })
      })
    }
  }, [isVisible, targetRef])

  if (!isVisible) return null

  return (
    <View
      style={[
        styles.container,
        { top: position.top, left: position.left, width: tooltipWidth },
      ]}
    >
      <View style={styles.arrow} />
      <Text style={styles.text}>{content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 5,
    padding: 10,
    zIndex: 1000,
    marginTop: 10,
  },
  arrow: {
    position: "absolute",
    top: -10,
    left: "50%",
    marginLeft: -10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(0, 0, 0, 0.8)",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
})

export default Tooltip
