export default function convertSecondToThirdPerson(
  text: string,
  name: string
): string {
  const namePossessive = name + "'s"

  const replacements: [
    RegExp,
    string | ((match: string, ...args: any[]) => string)
  ][] = [
    // you are -> [name] is
    [/\b(you)\s+(are)\b/gi, (_, you) => `${capitalizeIfNeeded(you, name)} is`],

    // you were -> [name] was
    [
      /\b(you)\s+(were)\b/gi,
      (_, you) => `${capitalizeIfNeeded(you, name)} was`,
    ],

    // you have -> [name] has
    [
      /\b(you)\s+(have)\b/gi,
      (_, you) => `${capitalizeIfNeeded(you, name)} has`,
    ],

    // you -> [name]
    [/\b(you)\b/gi, (match) => capitalizeIfNeeded(match, name)],

    // your -> [name]'s
    [/\b(your)\b/gi, (match) => capitalizeIfNeeded(match, namePossessive)],

    // yourself -> [name]self
    [/\b(yourself)\b/gi, (match) => capitalizeIfNeeded(match, `${name}self`)],

    // are -> is (when not preceded by you, which is handled above)
    [/(?<!you\s)\bare\b/gi, "is"],

    // were -> was (when not preceded by you, which is handled above)
    [/(?<!you\s)\bwere\b/gi, "was"],

    // have -> has (when not preceded by you, which is handled above)
    [/(?<!you\s)\bhave\b/gi, "has"],
  ]

  return replacements.reduce(
    (text, [regex, replacement]) => text.replace(regex, replacement as any),
    text
  )
}

function capitalizeIfNeeded(original: string, replacement: string): string {
  return original[0] === original[0].toUpperCase()
    ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
    : replacement
}
