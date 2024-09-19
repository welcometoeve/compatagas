import { ImageSourcePropType } from "react-native"

export type ResultLabel = {
  label: string
  emoji: string
}

export type Quiz = {
  id: number
  name: string
  src: ImageSourcePropType
  leftLabel: string
  rightLabel: string
  subtitle: {
    secondPerson: string
    thirdPerson: string
  }
  resultLabels?: ResultLabel[]
}

export type Side = "left" | "right" | "neither" | "new"

export type Option = {
  label: {
    secondPerson: string
    thirdPerson: string
  }
  side: Side
  emoji: string
}

export type Question = {
  id: number
  label: {
    secondPerson: string
    thirdPerson: string
  }
  options: Option[]
  quizId: number
}
