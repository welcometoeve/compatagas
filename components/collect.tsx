interface Answer {
  quizId: number
  userId: number
  optionIndex: number
}

export default function collect<T extends Record<string, any>>(
  items: T[],
  keys: (keyof T)[]
): T[][] {
  const groupMap = new Map<string, T[]>()

  for (const item of items) {
    const groupKey = keys.map((key) => String(item[key])).join("|")
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, [])
    }
    groupMap.get(groupKey)!.push(item)
  }

  return Array.from(groupMap.values())
}

// // Example usage:
// const answers: Answer[] = [
//   { quizId: 1, userId: 3, optionIndex: 0 },
//   { quizId: 1, userId: 3, optionIndex: 1 },
//   { quizId: 2, userId: 3, optionIndex: 2 },
//   { quizId: 3, userId: 0, optionIndex: 2 },
//   { quizId: 3, userId: 0, optionIndex: 3 },
// ]

// const result = collect(answers, ["quizId", "userId"])
// console.log(JSON.stringify(result, null, 2))
