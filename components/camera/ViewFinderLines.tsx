import { BlurView } from "expo-blur"
import { StyleSheet, View } from "react-native"

export default function ViewFinderLinesAbherration() {
  const opacity = 0.05
  return (
    <>
      <ViewFinderLines offset={-42} color="red" opacity={0.05} />
      <ViewFinderLines offset={-41.75} color="red" opacity={0.05} />
      <ViewFinderLines offset={-41.5} color="red" opacity={0.05} />
      <ViewFinderLines offset={-41.25} color="red" opacity={0.05} />
      <ViewFinderLines offset={-41} color="red" opacity={0.05} />
      <ViewFinderLines offset={-40.75} color="red" opacity={0.05} />
      <ViewFinderLines offset={-40.5} color="red" opacity={0.05} />
      <ViewFinderLines offset={-40.25} color="red" opacity={0.05} />

      <ViewFinderLines offset={-38} color="cyan" opacity={opacity} />
      <ViewFinderLines offset={-38.25} color="cyan" opacity={opacity} />
      <ViewFinderLines offset={-38.5} color="cyan" opacity={opacity} />
      <ViewFinderLines offset={-38.75} color="cyan" opacity={opacity} />
      <ViewFinderLines offset={-39} color="cyan" opacity={opacity} />
      <ViewFinderLines offset={-39.25} color="cyan" opacity={opacity} />
      <ViewFinderLines offset={-39.5} color="cyan" opacity={opacity} />
      <ViewFinderLines offset={-39.75} color="cyan" opacity={opacity} />

      <ViewFinderLines offset={-40} color="black" opacity={1} />
    </>
  )
}

function ViewFinderLines({
  offset,
  color,
  opacity,
}: {
  offset: number
  color: string
  opacity: number
}) {
  const Lines = () => (
    <View style={[styles.vectorContainer, { marginTop: offset, opacity }]}>
      <View style={[styles.topLeftCorner, { borderColor: color }]} />
      <View style={[styles.topRightCorner, { borderColor: color }]} />
      <View style={[styles.bottomLeftCorner, { borderColor: color }]} />
      <View style={[styles.bottomRightCorner, { borderColor: color }]} />
    </View>
  )
  return <Lines />
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  vectorContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 80, // Adjust the overall width as needed
    height: 120, // Adjust the overall height as needed
    marginTop: -40, // Half of the height to center it
    marginLeft: -40, // Half of the width to center it
  },
  topLeftCorner: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50, // Width of each corner
    height: 40, // Height of each corner
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "black", // Change color as needed
    borderTopLeftRadius: 20,
  },
  topRightCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 40,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 20,
    borderColor: "black", // Change color as needed
  },
  bottomLeftCorner: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 50,
    height: 40,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 20,
  },
  bottomRightCorner: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 40,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "black",
    borderBottomRightRadius: 20,
  },
})
