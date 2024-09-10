import React from "react"
import { StyleSheet, Text, View } from "react-native"

const MAX_SHOTS = 10

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Hi</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
})
