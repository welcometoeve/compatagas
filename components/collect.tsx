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
