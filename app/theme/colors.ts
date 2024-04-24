// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#D4C8BA",
  neutral200: "#cabeb2",
  neutral300: "#9c9ea2",
  neutral400: "#A49D9A",
  neutral500: "#928C7A",
  neutral600: "#797e76",
  neutral700: "#78888e",
  neutral800: "#3a4436", // Body Type
  neutral900: "#243020",

  primary100: "#88c3ea", // Retained as a muted primary color for image borders
  primary300: "#7ca1ae", // Retained as original primary color for text color
  primary400: "#753611",
  primary500: "#6287a1",
  primary600: "#6B5244",

  secondary100: "#7dc1dc", // Adjusted vibrant blue for lighter secondary elements
  secondary200: "#6a946b", // Adjusted vibrant blue for secondary variation
  secondary300: "#816750", // Warm, unique secondary
  secondary400: "#747338", // Rich, darker tone for secondary emphasis
  secondary500: "#5599b4", // Repeat of a warm primary for strong secondary actions

  accent100: "#D4C8BA",
  accent200: "#BC9C7B",
  accent300: "#A49D9A",
  accent500: "#969388",

  angry100: "#4c393d", // Chosen for a standout but not traditional "angry" look
  angry500: "#a07a7e", // Strong, noticeable color for errors

  overlay20: "rgba(48, 38, 32, 0.2)",
  overlay50: "rgba(85, 35, 39, 0.5)",
} as const

// const palette = {
//   neutral100: "#D4C8BA", // Lightest neutral, suitable for backgrounds
//   neutral200: "#C5AE99", // Light neutral
//   neutral300: "#BC9C7B", // Mid-light neutral
//   neutral400: "#A49D9A", // Mid-neutral for borders and separators
//   neutral500: "#928C7A", // Mid-dark neutral
//   neutral600: "#7E7976", // Dark neutral for secondary text
//   neutral700: "#676054", // Darker neutral for primary text
//   neutral800: "#2d2724", // Very dark neutral for headings
//   neutral900: "#0b0a0a", // Darkest, for body text or dark mode backgrounds

//   primary100: "#5C6C7C", // Cool, light for primary lighter elements
//   primary300: "#446470", // Unique, standout primary color
//   primary400: "#7F5137", // Warm, deep for primary buttons or icons
//   primary500: "#8C6752", // Warm mid-tone for main tinting color
//   primary600: "#6B5244", // Dark, rich for important primary elements

//   secondary100: "#A38673", // Light, warm secondary elements
//   secondary200: "#9F815F", // Warm tone for secondary variation
//   secondary300: "#816750", // Warm, unique secondary
//   secondary400: "#67392C", // Rich, darker tone for secondary emphasis
//   secondary500: "#7F5137", // Repeat of a warm primary for strong secondary actions

//   accent100: "#D4C8BA", // Lightest, for subtle accents
//   accent200: "#BC9C7B", // Light warm tone for gentle accentuation
//   accent300: "#A49D9A", // Soft, neutral accent
//   accent500: "#928C7A", // Neutral for noticeable accents

//   angry100: "#BC9C7B", // Chosen for a standout but not traditional "angry" look
//   angry500: "#8C6752", // Strong, noticeable color for errors

//   overlay20: "rgba(48, 38, 32, 0.2)", // Based on darkest neutral for overlay
//   overlay50: "rgba(48, 38, 32, 0.5)", // Dark base for stronger overlay effect
// } as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   *
   */
  errorBackground: palette.angry100,
}
