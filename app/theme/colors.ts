// TODO: write documentation for colors and palette in own markdown file and add links from here

// /* Color Theme Swatches in Hex */
// .color-theme_Art_of_Ashley_Wood_128-1-hex { color: #809FA6; }
// .color-theme_Art_of_Ashley_Wood_128-2-hex { color: #A69580; }
// .color-theme_Art_of_Ashley_Wood_128-3-hex { color: #D9BBA9; }
// .color-theme_Art_of_Ashley_Wood_128-4-hex { color: #733F34; }
// .color-theme_Art_of_Ashley_Wood_128-5-hex { color: #A63B32; }

// /* Color Theme Swatches in RGBA */
// .color-theme_Art_of_Ashley_Wood_128-1-rgba { color: rgba(128, 159, 166, 1); }
// .color-theme_Art_of_Ashley_Wood_128-2-rgba { color: rgba(166, 149, 128, 1); }
// .color-theme_Art_of_Ashley_Wood_128-3-rgba { color: rgba(217, 187, 169, 1); }
// .color-theme_Art_of_Ashley_Wood_128-4-rgba { color: rgba(115, 63, 52, 1); }
// .color-theme_Art_of_Ashley_Wood_128-5-rgba { color: rgba(166, 59, 50, 1); }

// /* Color Theme Swatches in HSLA */
// .color-theme_Art_of_Ashley_Wood_128-1-hsla { color: hsla(191, 17, 57, 1); }
// .color-theme_Art_of_Ashley_Wood_128-2-hsla { color: hsla(33, 17, 57, 1); }
// .color-theme_Art_of_Ashley_Wood_128-3-hsla { color: hsla(22, 38, 75, 1); }
// .color-theme_Art_of_Ashley_Wood_128-4-hsla { color: hsla(10, 37, 32, 1); }
// .color-theme_Art_of_Ashley_Wood_128-5-hsla { color: hsla(4, 53, 42, 1); }

const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#F4F2F1",
  neutral300: "#D7CEC9",
  neutral400: "#B6ACA6",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#809FA6",
  primary200: "#A69580",
  primary300: "#D9BBA9",
  primary400: "#733F34",
  primary500: "#69788C", //icon color
  primary600: "#59504A",

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#41476E",

  accent100: "#CEBEAF",
  accent200: "#D9CDC1",
  accent300: "#FBDDB9",
  accent400: "#DCBE98",
  accent500: "#F2E6D8",

  angry100: "#F2D6CD",
  angry500: "#730202",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const

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
