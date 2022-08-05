export type CustomEmojiNode = {
  frozenSrc: string,
  type: 'customEmoji',
  src: string,
  alt: string,
  id: string
}

export type EmojiNode = {
  type: 'emoji',
  surrogate: string,
  jumboable: boolean,
  content: string
}

export type MessageEmojiActionSheetArgs = [
  { emojiNode: EmojiNode | CustomEmojiNode }
]