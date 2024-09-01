import { Platform } from "react-native"

const defaultTheme = {
  colors: {
    neutral100: "#D4C8BA",
    neutral200: "#CABEB2",
    neutral300: "#9C9EA2",
    neutral400: "#A49D9A",
    neutral500: "#928C7A",
    neutral600: "#797E76",
    neutral700: "#78888E",
    neutral800: "#3A4436",
    neutral900: "#243020",
    primary100: "#88C3EA",
    primary300: "#7CA1AE",
    primary400: "#753611",
    primary500: "#6287A1",
    primary600: "#6B5244",
    secondary100: "#7DC1DC",
    secondary200: "#6A946B",
    secondary300: "#816750",
    secondary400: "#747338",
    secondary500: "#5599B4",
    accent100: "#D4C8BA",
    accent200: "#BC9C7B",
    accent300: "#A49D9A",
    accent500: "#969388",
    angry100: "#4C393D",
    angry500: "#A07A7E",
    overlay20: "rgba(48, 38, 32, 0.2)",
    overlay50: "rgba(85, 35, 39, 0.5)",
    transparent: "rgba(0, 0, 0, 0)",
  },
  spacing: {
    xxxs: 2,
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  typography: {
    primary: {
      light: "spaceGroteskLight",
      normal: "spaceGroteskRegular",
      medium: "spaceGroteskMedium",
      semiBold: "spaceGroteskSemiBold",
      bold: "spaceGroteskBold",
    },
    secondary: Platform.select({
      ios: "Helvetica Neue",
      android: "sans-serif",
    }),
    code: Platform.select({
      ios: "Courier",
      android: "monospace",
    }),
  },
}

export default defaultTheme
